'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Users, TrendingUp, Globe, Clock, DollarSign 
} from 'lucide-react';

interface AnalyticsData {
  pageViews: Array<{ date: string; views: number; uniqueUsers: number }>;
  userEngagement: Array<{ page: string; avgTime: number; bounceRate: number }>;
  deviceBreakdown: Array<{ device: string; users: number; percentage: number }>;
  tournamentInterest: Array<{ tournament: string; views: number; registrations: number }>;
  revenueData: Array<{ month: string; merchandise: number; memberships: number }>;
  webVitals: {
    cls: number;
    lcp: number;
    fid: number;
    inp: number;
    ttfb: number;
  };
}

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from your analytics API
      // For now, we'll use mock data that represents the type of analytics you'd have
      const mockData: AnalyticsData = {
        pageViews: [
          { date: '2025-09-09', views: 1250, uniqueUsers: 890 },
          { date: '2025-09-10', views: 1420, uniqueUsers: 1020 },
          { date: '2025-09-11', views: 1680, uniqueUsers: 1180 },
          { date: '2025-09-12', views: 1890, uniqueUsers: 1340 },
          { date: '2025-09-13', views: 2100, uniqueUsers: 1520 },
          { date: '2025-09-14', views: 1950, uniqueUsers: 1430 },
          { date: '2025-09-15', views: 2350, uniqueUsers: 1680 },
        ],
        userEngagement: [
          { page: 'Homepage', avgTime: 145, bounceRate: 35 },
          { page: 'Journey', avgTime: 320, bounceRate: 25 },
          { page: 'Simulator', avgTime: 480, bounceRate: 15 },
          { page: 'Shop', avgTime: 220, bounceRate: 45 },
          { page: 'Fan Club', avgTime: 280, bounceRate: 30 },
        ],
        deviceBreakdown: [
          { device: 'Desktop', users: 4200, percentage: 42 },
          { device: 'Mobile', users: 4800, percentage: 48 },
          { device: 'Tablet', users: 1000, percentage: 10 },
        ],
        tournamentInterest: [
          { tournament: 'Stones Golf 2025', views: 2800, registrations: 145 },
          { tournament: 'Uncle Joe Classic', views: 2200, registrations: 98 },
          { tournament: 'Spring Championship', views: 1800, registrations: 76 },
          { tournament: 'Winter Series', views: 1400, registrations: 52 },
        ],
        revenueData: [
          { month: 'May', merchandise: 8500, memberships: 12000 },
          { month: 'Jun', merchandise: 9200, memberships: 14500 },
          { month: 'Jul', merchandise: 11800, memberships: 16200 },
          { month: 'Aug', merchandise: 13400, memberships: 18800 },
          { month: 'Sep', merchandise: 15200, memberships: 21500 },
        ],
        webVitals: {
          cls: 0.08,
          lcp: 1200,
          fid: 45,
          inp: 120,
          ttfb: 380,
        },
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    );
  }

  const totalUsers = analyticsData.pageViews.reduce((sum, day) => sum + day.uniqueUsers, 0);
  const totalViews = analyticsData.pageViews.reduce((sum, day) => sum + day.views, 0);
  const avgEngagementTime = analyticsData.userEngagement.reduce((sum, page) => sum + page.avgTime, 0) / analyticsData.userEngagement.length;
  const totalRevenue = analyticsData.revenueData.reduce((sum, month) => sum + month.merchandise + month.memberships, 0);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          icon={<Users className="h-6 w-6" />}
          change="+12.5%"
          positive={true}
        />
        <MetricCard
          title="Page Views"
          value={totalViews.toLocaleString()}
          icon={<Globe className="h-6 w-6" />}
          change="+8.3%"
          positive={true}
        />
        <MetricCard
          title="Avg. Engagement"
          value={`${Math.round(avgEngagementTime)}s`}
          icon={<Clock className="h-6 w-6" />}
          change="+5.7%"
          positive={true}
        />
        <MetricCard
          title="Revenue"
          value={`$${(totalRevenue / 1000).toFixed(1)}k`}
          icon={<DollarSign className="h-6 w-6" />}
          change="+23.1%"
          positive={true}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Trend */}
        <ChartCard title="Page Views & Users">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.pageViews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
              <Area type="monotone" dataKey="views" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="uniqueUsers" stackId="2" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Device Breakdown */}
        <ChartCard title="Device Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.deviceBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="users"
              >
                {analyticsData.deviceBreakdown.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* User Engagement */}
        <ChartCard title="Page Engagement">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.userEngagement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="page" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgTime" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Tournament Interest */}
        <ChartCard title="Tournament Interest">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.tournamentInterest}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tournament" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#8B5CF6" />
              <Bar dataKey="registrations" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Revenue and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2">
          <ChartCard title="Revenue Trend">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, '']} />
                <Line type="monotone" dataKey="merchandise" stroke="#10B981" strokeWidth={3} />
                <Line type="monotone" dataKey="memberships" stroke="#8B5CF6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Web Vitals */}
        <ChartCard title="Web Vitals Performance">
          <div className="space-y-4">
            <VitalMetric label="CLS" value={analyticsData.webVitals.cls} target={0.1} unit="" />
            <VitalMetric label="LCP" value={analyticsData.webVitals.lcp} target={2500} unit="ms" />
            <VitalMetric label="FID" value={analyticsData.webVitals.fid} target={100} unit="ms" />
            <VitalMetric label="INP" value={analyticsData.webVitals.inp} target={200} unit="ms" />
            <VitalMetric label="TTFB" value={analyticsData.webVitals.ttfb} target={600} unit="ms" />
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, change, positive }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-purple-600">{icon}</div>
      </div>
      <div className={`flex items-center mt-2 text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
        <TrendingUp className="h-4 w-4 mr-1" />
        {change}
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function VitalMetric({ label, value, target, unit }: {
  label: string;
  value: number;
  target: number;
  unit: string;
}) {
  const isGood = value <= target;
  const percentage = Math.min((value / target) * 100, 100);
  
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className={isGood ? 'text-green-600' : 'text-red-600'}>
          {value}{unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
        <div 
          className={`h-2 rounded-full ${isGood ? 'bg-green-500' : 'bg-red-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}