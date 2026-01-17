import json
import os
import psycopg2
from datetime import datetime
from typing import Dict, List, Optional


def handler(event: dict, context) -> dict:
    """
    API для управления парсингом контактов с различных площадок.
    Поддерживает запуск парсинга, получение статистики и настройку источников.
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    try:
        conn = get_db_connection()
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'parse':
                result = run_parser(conn, body)
                return success_response(result)
            elif action == 'add_contact':
                result = add_contact_manually(conn, body)
                return success_response(result)
            elif action == 'update_settings':
                result = update_parser_settings(conn, body)
                return success_response(result)
            else:
                return error_response('Unknown action', 400)
        
        elif method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            action = query_params.get('action', 'stats')
            
            if action == 'stats':
                stats = get_statistics(conn)
                return success_response(stats)
            elif action == 'contacts':
                limit = int(query_params.get('limit', 100))
                source = query_params.get('source')
                contacts = get_contacts(conn, limit, source)
                return success_response({'contacts': contacts})
            elif action == 'settings':
                settings = get_parser_settings(conn)
                return success_response({'settings': settings})
            else:
                return error_response('Unknown action', 400)
        
        else:
            return error_response('Method not allowed', 405)
            
    except Exception as e:
        return error_response(str(e), 500)
    finally:
        if 'conn' in locals():
            conn.close()


def get_db_connection():
    """Подключение к PostgreSQL"""
    return psycopg2.connect(os.environ['DATABASE_URL'])


def run_parser(conn, body: dict) -> dict:
    """Запуск парсера для указанной платформы"""
    platform = body.get('platform', 'all')
    city = body.get('city', 'Челябинск')
    
    cur = conn.cursor()
    
    contacts_added = []
    
    if platform in ['avito', 'all']:
        contacts_added.extend(parse_avito(conn, city))
    
    if platform in ['cian', 'all']:
        contacts_added.extend(parse_cian(conn, city))
    
    if platform in ['telegram', 'all']:
        contacts_added.extend(parse_telegram_channels(conn, city))
    
    cur.execute("""
        UPDATE parser_settings 
        SET last_run = %s 
        WHERE platform = %s
    """, (datetime.now(), platform))
    conn.commit()
    
    if contacts_added:
        send_to_telegram(contacts_added)
    
    return {
        'success': True,
        'platform': platform,
        'contacts_added': len(contacts_added),
        'timestamp': datetime.now().isoformat()
    }


def parse_avito(conn, city: str) -> List[dict]:
    """Парсинг Avito (заглушка - требует реальной реализации)"""
    contacts = [
        {
            'full_name': 'Иван Петров',
            'phone': '+79001234567',
            'source': 'avito',
            'source_url': 'https://avito.ru/...',
            'city': city,
            'activity_level': 'Высокая'
        }
    ]
    
    for contact in contacts:
        add_contact_to_db(conn, contact)
    
    return contacts


def parse_cian(conn, city: str) -> List[dict]:
    """Парсинг Циан (заглушка)"""
    contacts = [
        {
            'full_name': 'Мария Сидорова',
            'phone': '+79007654321',
            'source': 'cian',
            'source_url': 'https://cian.ru/...',
            'city': city,
            'activity_level': 'Средняя'
        }
    ]
    
    for contact in contacts:
        add_contact_to_db(conn, contact)
    
    return contacts


def parse_telegram_channels(conn, city: str) -> List[dict]:
    """Парсинг Telegram каналов ЖК (заглушка)"""
    contacts = [
        {
            'username': '@user_from_jk',
            'source': 'telegram',
            'source_url': 't.me/jk_channel',
            'city': city,
            'activity_level': 'Высокая'
        }
    ]
    
    for contact in contacts:
        add_contact_to_db(conn, contact)
    
    return contacts


def add_contact_to_db(conn, contact: dict) -> int:
    """Добавление контакта в базу данных"""
    cur = conn.cursor()
    
    cur.execute("""
        INSERT INTO contacts (
            full_name, username, phone, email, city, 
            source, source_url, activity_level, status
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING
        RETURNING id
    """, (
        contact.get('full_name'),
        contact.get('username'),
        contact.get('phone'),
        contact.get('email'),
        contact.get('city'),
        contact.get('source'),
        contact.get('source_url'),
        contact.get('activity_level', 'Средняя'),
        contact.get('status', 'Новый')
    ))
    
    result = cur.fetchone()
    conn.commit()
    
    return result[0] if result else None


def add_contact_manually(conn, body: dict) -> dict:
    """Ручное добавление контакта"""
    contact_id = add_contact_to_db(conn, body)
    
    return {
        'success': True,
        'contact_id': contact_id,
        'message': 'Контакт добавлен'
    }


def get_statistics(conn) -> dict:
    """Получение статистики по контактам"""
    cur = conn.cursor()
    
    cur.execute("SELECT COUNT(*) FROM contacts")
    total_contacts = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM contacts WHERE created_at > NOW() - INTERVAL '7 days'")
    new_this_week = cur.fetchone()[0]
    
    cur.execute("SELECT source, COUNT(*) FROM contacts GROUP BY source")
    by_source = dict(cur.fetchall())
    
    cur.execute("SELECT status, COUNT(*) FROM contacts GROUP BY status")
    by_status = dict(cur.fetchall())
    
    return {
        'total_contacts': total_contacts,
        'new_this_week': new_this_week,
        'by_source': by_source,
        'by_status': by_status
    }


def get_contacts(conn, limit: int = 100, source: Optional[str] = None) -> List[dict]:
    """Получение списка контактов"""
    cur = conn.cursor()
    
    if source:
        cur.execute("""
            SELECT id, full_name, username, phone, email, city, 
                   source, source_url, activity_level, status, created_at
            FROM contacts 
            WHERE source = %s
            ORDER BY created_at DESC 
            LIMIT %s
        """, (source, limit))
    else:
        cur.execute("""
            SELECT id, full_name, username, phone, email, city, 
                   source, source_url, activity_level, status, created_at
            FROM contacts 
            ORDER BY created_at DESC 
            LIMIT %s
        """, (limit,))
    
    columns = ['id', 'full_name', 'username', 'phone', 'email', 'city', 
               'source', 'source_url', 'activity_level', 'status', 'created_at']
    
    contacts = []
    for row in cur.fetchall():
        contact = dict(zip(columns, row))
        if contact['created_at']:
            contact['created_at'] = contact['created_at'].isoformat()
        contacts.append(contact)
    
    return contacts


def get_parser_settings(conn) -> List[dict]:
    """Получение настроек парсера"""
    cur = conn.cursor()
    
    cur.execute("""
        SELECT platform, enabled, last_run, search_query, filters
        FROM parser_settings
    """)
    
    settings = []
    for row in cur.fetchall():
        settings.append({
            'platform': row[0],
            'enabled': row[1],
            'last_run': row[2].isoformat() if row[2] else None,
            'search_query': row[3],
            'filters': row[4]
        })
    
    return settings


def update_parser_settings(conn, body: dict) -> dict:
    """Обновление настроек парсера"""
    cur = conn.cursor()
    
    platform = body.get('platform')
    enabled = body.get('enabled')
    search_query = body.get('search_query')
    filters = body.get('filters')
    
    cur.execute("""
        INSERT INTO parser_settings (platform, enabled, search_query, filters)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (platform) 
        DO UPDATE SET 
            enabled = EXCLUDED.enabled,
            search_query = EXCLUDED.search_query,
            filters = EXCLUDED.filters,
            updated_at = CURRENT_TIMESTAMP
    """, (platform, enabled, search_query, json.dumps(filters) if filters else None))
    
    conn.commit()
    
    return {
        'success': True,
        'message': f'Настройки для {platform} обновлены'
    }


def send_to_telegram(contacts: List[dict]):
    """Отправка новых контактов в Telegram канал"""
    import requests
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    channel_id = os.environ.get('TELEGRAM_CHANNEL_ID')
    
    if not bot_token or not channel_id:
        print('Telegram credentials not configured')
        return
    
    for contact in contacts:
        message = format_contact_message(contact)
        
        url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
        payload = {
            'chat_id': channel_id,
            'text': message,
            'parse_mode': 'HTML'
        }
        
        try:
            requests.post(url, json=payload, timeout=10)
        except Exception as e:
            print(f'Failed to send to Telegram: {e}')


def format_contact_message(contact: dict) -> str:
    """Форматирование сообщения о контакте для Telegram"""
    name = contact.get('full_name') or contact.get('username') or 'Неизвестно'
    phone = contact.get('phone', 'Не указан')
    source = contact.get('source', 'unknown')
    url = contact.get('source_url', '')
    
    message = f"<b>🆕 Новый контакт</b>\n\n"
    message += f"<b>Имя:</b> {name}\n"
    message += f"<b>Телефон:</b> {phone}\n"
    message += f"<b>Источник:</b> {source}\n"
    
    if url:
        message += f"<b>Ссылка:</b> {url}\n"
    
    return message


def success_response(data: dict) -> dict:
    """Успешный ответ"""
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data, ensure_ascii=False)
    }


def error_response(message: str, status_code: int = 500) -> dict:
    """Ответ с ошибкой"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}, ensure_ascii=False)
    }
