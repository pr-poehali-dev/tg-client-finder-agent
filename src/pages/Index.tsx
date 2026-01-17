import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';

const mockContacts = [
  { id: 1, name: 'Алексей Иванов', username: '@alex_ivanov', city: 'Москва', activity: 'Высокая', status: 'Новый' },
  { id: 2, name: 'Мария Петрова', username: '@maria_p', city: 'Москва', activity: 'Средняя', status: 'В работе' },
  { id: 3, name: 'Дмитрий Сидоров', username: '@dmitry_s', city: 'Москва', activity: 'Низкая', status: 'Новый' },
  { id: 4, name: 'Елена Козлова', username: '@elena_koz', city: 'Москва', activity: 'Высокая', status: 'Конвертирован' },
  { id: 5, name: 'Сергей Новиков', username: '@sergey_nov', city: 'Москва', activity: 'Средняя', status: 'В работе' },
];

const mockCampaigns = [
  { id: 1, name: 'Январская кампания', sent: 450, opened: 320, converted: 45, rate: '10%' },
  { id: 2, name: 'Февральская кампания', sent: 380, opened: 280, converted: 38, rate: '10%' },
  { id: 3, name: 'Мартовская кампания', sent: 520, opened: 410, converted: 62, rate: '12%' },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-sidebar text-sidebar-foreground p-6 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Search" className="text-primary" size={24} />
            <h1 className="text-xl font-bold">TG Agent</h1>
          </div>
          <p className="text-xs text-sidebar-foreground/60">Поиск клиентов в Telegram</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'hover:bg-sidebar-accent/50'
            }`}
          >
            <Icon name="LayoutDashboard" size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'search' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'hover:bg-sidebar-accent/50'
            }`}
          >
            <Icon name="Users" size={20} />
            <span className="font-medium">Поиск</span>
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'analytics' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'hover:bg-sidebar-accent/50'
            }`}
          >
            <Icon name="BarChart3" size={20} />
            <span className="font-medium">Аналитика</span>
          </button>
        </nav>
        
        <div className="pt-6 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
              АИ
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Агент ИИ</p>
              <p className="text-xs text-sidebar-foreground/60">Активен</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="dashboard" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
              <p className="text-muted-foreground">Обзор ключевых метрик и статистики</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Всего контактов</CardDescription>
                  <CardTitle className="text-4xl">1,284</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Icon name="TrendingUp" size={12} className="mr-1" />
                      +12.5%
                    </Badge>
                    <span className="text-muted-foreground">за месяц</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Активные контакты</CardDescription>
                  <CardTitle className="text-4xl">856</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Icon name="Activity" size={12} className="mr-1" />
                      66.7%
                    </Badge>
                    <span className="text-muted-foreground">от общего</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Конверсия</CardDescription>
                  <CardTitle className="text-4xl">10.8%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Icon name="TrendingUp" size={12} className="mr-1" />
                      +2.3%
                    </Badge>
                    <span className="text-muted-foreground">к прошлому</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Новые за неделю</CardDescription>
                  <CardTitle className="text-4xl">142</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      <Icon name="UserPlus" size={12} className="mr-1" />
                      Активно
                    </Badge>
                    <span className="text-muted-foreground">растёт</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Последние контакты</CardTitle>
                  <CardDescription>5 недавно добавленных контактов</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockContacts.slice(0, 5).map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {contact.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{contact.name}</p>
                            <p className="text-xs text-muted-foreground">{contact.username}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{contact.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Активность по дням</CardTitle>
                  <CardDescription>Динамика за последние 7 дней</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { day: 'Пн', value: 68 },
                      { day: 'Вт', value: 52 },
                      { day: 'Ср', value: 84 },
                      { day: 'Чт', value: 72 },
                      { day: 'Пт', value: 91 },
                      { day: 'Сб', value: 45 },
                      { day: 'Вс', value: 38 },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-8 text-muted-foreground">{item.day}</span>
                        <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-lg transition-all"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-8 text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Поиск контактов</h2>
              <p className="text-muted-foreground">Найдите и отфильтруйте потенциальных клиентов</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Фильтры поиска</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input placeholder="Поиск по имени..." className="col-span-1 md:col-span-2" />
                  
                  <Select defaultValue="moscow">
                    <SelectTrigger>
                      <SelectValue placeholder="Город" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moscow">Москва</SelectItem>
                      <SelectItem value="spb">Санкт-Петербург</SelectItem>
                      <SelectItem value="ekb">Екатеринбург</SelectItem>
                      <SelectItem value="chel">Челябинск</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="new">Новый</SelectItem>
                      <SelectItem value="progress">В работе</SelectItem>
                      <SelectItem value="converted">Конвертирован</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button className="gap-2">
                    <Icon name="Search" size={16} />
                    Найти контакты
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Icon name="Download" size={16} />
                    Экспорт
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Найдено контактов: {mockContacts.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Имя</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Город</TableHead>
                      <TableHead>Активность</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell className="text-muted-foreground">{contact.username}</TableCell>
                        <TableCell>{contact.city}</TableCell>
                        <TableCell>
                          <Badge variant={contact.activity === 'Высокая' ? 'default' : 'outline'}>
                            {contact.activity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{contact.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Icon name="MoreVertical" size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Аналитика</h2>
              <p className="text-muted-foreground">Углубленная аналитика и метрики эффективности</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Конверсия по кампаниям</CardTitle>
                  <CardDescription>Результаты последних кампаний</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Кампания</TableHead>
                        <TableHead className="text-right">Отправлено</TableHead>
                        <TableHead className="text-right">Открыто</TableHead>
                        <TableHead className="text-right">Конверсия</TableHead>
                        <TableHead className="text-right">Процент</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCampaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell className="text-right">{campaign.sent}</TableCell>
                          <TableCell className="text-right">{campaign.opened}</TableCell>
                          <TableCell className="text-right font-semibold text-primary">{campaign.converted}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {campaign.rate}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Средняя конверсия</span>
                        <span className="font-semibold">10.7%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '10.7%' }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Открываемость</span>
                        <span className="font-semibold">75.4%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: '75.4%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>География</CardTitle>
                  <CardDescription>Распределение по городам</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { city: 'Москва', count: 742, percent: 57.8 },
                    { city: 'Санкт-Петербург', count: 318, percent: 24.8 },
                    { city: 'Екатеринбург', count: 142, percent: 11.1 },
                    { city: 'Челябинск', count: 58, percent: 4.5 },
                    { city: 'Казань', count: 24, percent: 1.8 },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">{item.city}</span>
                        <span className="text-muted-foreground">{item.count}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ROI кампаний</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">348%</div>
                  <p className="text-sm text-muted-foreground">Средний возврат инвестиций</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Icon name="TrendingUp" size={12} className="mr-1" />
                      +24% к Q3
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Время отклика</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">2.4ч</div>
                  <p className="text-sm text-muted-foreground">Средний ответ клиента</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Icon name="Clock" size={12} className="mr-1" />
                      Оптимально
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Повторные покупки</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">43%</div>
                  <p className="text-sm text-muted-foreground">Клиенты вернулись повторно</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      <Icon name="Repeat" size={12} className="mr-1" />
                      Растёт
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;