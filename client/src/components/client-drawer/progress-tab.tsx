import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ProgressData } from '../../types';

interface ClientProgressTabProps {
  progress: ProgressData[];
}

export function ClientProgressTab({ progress }: ClientProgressTabProps) {
  const avgWorkouts = progress.length > 0 
    ? Math.round(progress.reduce((acc, p) => acc + p.workouts, 0) / progress.length) 
    : 0;
  const avgNutrition = progress.length > 0 
    ? Math.round(progress.reduce((acc, p) => acc + p.nutrition, 0) / progress.length) 
    : 0;
  const avgSleep = progress.length > 0 
    ? Math.round(progress.reduce((acc, p) => acc + p.sleep, 0) / progress.length) 
    : 0;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="7d" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="7d">7 Days</TabsTrigger>
          <TabsTrigger value="30d">30 Days</TabsTrigger>
          <TabsTrigger value="90d">90 Days</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progress}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="workouts" 
                  name="Workouts"
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="nutrition" 
                  name="Nutrition"
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sleep" 
                  name="Sleep"
                  stroke="hsl(var(--chart-4))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-4))', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-mono font-bold text-chart-1">{avgWorkouts}%</div>
            <p className="text-xs text-muted-foreground mt-1">Avg Workout Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-mono font-bold text-chart-2">{avgNutrition}%</div>
            <p className="text-xs text-muted-foreground mt-1">Avg Nutrition Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-mono font-bold text-chart-4">{avgSleep}%</div>
            <p className="text-xs text-muted-foreground mt-1">Avg Sleep Score</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
