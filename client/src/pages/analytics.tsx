import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Header } from '../components/header';
import { MetricCard } from '../components/metric-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, Target, Zap } from 'lucide-react';
import { clientsService, directivesService } from '../services';
import type { Client, MentorDirective } from '../types';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function Analytics() {
  const [clients, setClients] = useState<Client[]>([]);
  const [directives, setDirectives] = useState<MentorDirective[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [clientsData, directivesData] = await Promise.all([
        clientsService.getClients('mentor-1'),
        directivesService.getDirectives('mentor-1'),
      ]);
      setClients(clientsData);
      setDirectives(directivesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusDistribution = [
    { name: 'Active', value: clients.filter(c => c.status === 'active').length },
    { name: 'Trial', value: clients.filter(c => c.status === 'trial').length },
    { name: 'Inactive', value: clients.filter(c => c.status === 'inactive').length },
    { name: 'Pending', value: clients.filter(c => c.status === 'pending').length },
    { name: 'Suspended', value: clients.filter(c => c.status === 'suspended').length },
  ].filter(d => d.value > 0);

  const progressDistribution = [
    { range: '0-25%', count: clients.filter(c => c.progress <= 25).length },
    { range: '26-50%', count: clients.filter(c => c.progress > 25 && c.progress <= 50).length },
    { range: '51-75%', count: clients.filter(c => c.progress > 50 && c.progress <= 75).length },
    { range: '76-100%', count: clients.filter(c => c.progress > 75).length },
  ];

  const directiveCategories = [
    { category: 'Nutrition', count: directives.filter(d => d.category === 'nutrition').length },
    { category: 'Workout', count: directives.filter(d => d.category === 'workout').length },
    { category: 'Recovery', count: directives.filter(d => d.category === 'recovery').length },
    { category: 'Motivation', count: directives.filter(d => d.category === 'motivation').length },
    { category: 'General', count: directives.filter(d => d.category === 'general').length },
  ].filter(d => d.count > 0);

  const totalTriggers = directives.reduce((sum, d) => sum + d.triggeredCount, 0);
  const avgEffectiveness = directives
    .filter(d => d.effectivenessScore)
    .reduce((sum, d) => sum + (d.effectivenessScore || 0), 0) / 
    directives.filter(d => d.effectivenessScore).length || 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Analytics" />
      
      <main className="flex-1 p-6 space-y-6">
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-80" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label="Total Clients"
                value={clients.length}
                trend={12}
                icon={<Users className="w-5 h-5" />}
              />
              <MetricCard
                label="Avg Progress"
                value={`${Math.round(clients.reduce((sum, c) => sum + c.progress, 0) / clients.length)}%`}
                trend={5}
                icon={<Target className="w-5 h-5" />}
              />
              <MetricCard
                label="Directives Triggered"
                value={totalTriggers}
                trend={18}
                icon={<Zap className="w-5 h-5" />}
              />
              <MetricCard
                label="Avg Effectiveness"
                value={`${Math.round(avgEffectiveness * 100)}%`}
                trend={3}
                icon={<TrendingUp className="w-5 h-5" />}
              />
            </div>

            <Tabs defaultValue="clients" className="space-y-6">
              <TabsList>
                <TabsTrigger value="clients">Client Analytics</TabsTrigger>
                <TabsTrigger value="directives">Directive Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="clients" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Client Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={statusDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}`}
                            >
                              {statusDistribution.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-center mt-2 text-2xl font-mono font-bold">
                        {clients.length}
                        <span className="text-sm text-muted-foreground font-normal ml-2">total clients</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Progress Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={progressDistribution}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis 
                              dataKey="range" 
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                            />
                            <YAxis 
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px'
                              }}
                            />
                            <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="directives" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Directives by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={directiveCategories} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis 
                              type="number"
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                            />
                            <YAxis 
                              type="category"
                              dataKey="category"
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                              width={80}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px'
                              }}
                            />
                            <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Top Performing Directives</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {directives
                          .filter(d => d.effectivenessScore)
                          .sort((a, b) => (b.effectivenessScore || 0) - (a.effectivenessScore || 0))
                          .slice(0, 5)
                          .map((directive, index) => (
                            <div key={directive.id} className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-mono text-muted-foreground w-4">
                                  {index + 1}.
                                </span>
                                <div>
                                  <p className="text-sm font-medium">{directive.name}</p>
                                  <p className="text-xs text-muted-foreground capitalize">
                                    {directive.category} - {directive.triggeredCount} triggers
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm font-mono font-bold text-chart-4">
                                {Math.round((directive.effectivenessScore || 0) * 100)}%
                              </span>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}
