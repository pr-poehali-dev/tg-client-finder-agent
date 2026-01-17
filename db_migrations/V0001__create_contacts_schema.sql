-- Таблица для хранения контактов с разных площадок
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255),
    username VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    city VARCHAR(100) DEFAULT 'Челябинск',
    source VARCHAR(100) NOT NULL,
    source_url TEXT,
    activity_level VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Новый',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_phone_source ON contacts(phone, source) WHERE phone IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_username_source ON contacts(username, source) WHERE username IS NOT NULL;

-- Таблица для отслеживания кампаний
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sent_count INT DEFAULT 0,
    opened_count INT DEFAULT 0,
    converted_count INT DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Активна',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для связи контактов и кампаний
CREATE TABLE IF NOT EXISTS contact_campaigns (
    id SERIAL PRIMARY KEY,
    contact_id INT REFERENCES contacts(id),
    campaign_id INT REFERENCES campaigns(id),
    sent_at TIMESTAMP,
    opened_at TIMESTAMP,
    converted_at TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_contact_campaigns_unique ON contact_campaigns(contact_id, campaign_id);

-- Таблица для хранения настроек парсинга
CREATE TABLE IF NOT EXISTS parser_settings (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(100) NOT NULL UNIQUE,
    enabled BOOLEAN DEFAULT true,
    last_run TIMESTAMP,
    search_query TEXT,
    filters JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для ускорения поиска
CREATE INDEX IF NOT EXISTS idx_contacts_source ON contacts(source);
CREATE INDEX IF NOT EXISTS idx_contacts_city ON contacts(city);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
