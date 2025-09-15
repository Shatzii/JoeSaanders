'use client';
import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  DollarSign,
  Target,
  Clock,
  Eye,
  MousePointer,
  Smartphone,
  Monitor,
  Globe,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Trophy,
  Award,
  Star,
  Crown,
  PieChart,
  LineChart,
  BarChart,
  AreaChart,
  ScatterChart,
  Radar,
  Gauge,
  Thermometer,
  Battery,
  Wifi,
  Server,
  Database,
  HardDrive,
  Cpu,
  MemoryStick,
  Settings,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  CreditCard,
  Wallet,
  PiggyBank,
  Receipt,
  Calculator,
  Percent,
  Hash,
  AtSign,
  Search,
  SortAsc,
  SortDesc,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Minus,
  X,
  Check,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Octagon,
  Heart,
  Shield,
  Lock,
  Key,
  Unlock,
  User,
  UserPlus,
  UserMinus,
  UserCheck,
  Building,
  Building2,
  Factory,
  Warehouse,
  Store,
  ShoppingCart,
  ShoppingBag,
  Package,
  Truck,
  Car,
  Bike,
  Plane,
  Ship,
  Train,
  Bus,
  Taxi,
  Ambulance,
  FireTruck,
  Police,
  Helicopter,
  Rocket,
  Satellite,
  Antenna,
  Bluetooth,
  Plug,
  Power,
  Lightbulb,
  Tv,
  Laptop,
  Tablet,
  Keyboard,
  Printer,
  Speaker,
  Headphones,
  Microphone,
  Camera,
  Video,
  Image,
  File,
  Folder,
  Archive,
  Trash2,
  Edit,
  Save,
  Copy,
  Scissors,
  Clipboard,
  Music,
  Film,
  Gamepad2,
  Joystick,
  Puzzle,
  Medal,
  Gem,
  Diamond,
  Flame,
  Snowflake,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  Timer,
  Stopwatch,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Video as VideoIcon,
  Image as ImageIcon,
  File as FileIcon,
  Folder as FolderIcon,
  Archive as ArchiveIcon,
  Trash2 as Trash2Icon,
  Edit as EditIcon,
  Save as SaveIcon,
  Copy as CopyIcon,
  Scissors as ScissorsIcon,
  Clipboard as ClipboardIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  SortAsc as SortAscIcon,
  SortDesc as SortDescIcon,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  MoreHorizontal as MoreHorizontalIcon,
  MoreVertical as MoreVerticalIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  X as XIcon,
  Check as CheckIcon,
  Circle as CircleIcon,
  Square as SquareIcon,
  Triangle as TriangleIcon,
  Hexagon as HexagonIcon,
  Octagon as OctagonIcon,
  Heart as HeartIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Key as KeyIcon,
  Unlock as UnlockIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  UserMinus as UserMinusIcon,
  UserCheck as UserCheckIcon,
  Building as BuildingIcon,
  Building2 as Building2Icon,
  Factory as FactoryIcon,
  Warehouse as WarehouseIcon,
  Store as StoreIcon,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag as ShoppingBagIcon,
  Package as PackageIcon,
  Truck as TruckIcon,
  Car as CarIcon,
  Bike as BikeIcon,
  Plane as PlaneIcon,
  Ship as ShipIcon,
  Train as TrainIcon,
  Bus as BusIcon,
  Taxi as TaxiIcon,
  Ambulance as AmbulanceIcon,
  FireTruck as FireTruckIcon,
  Police as PoliceIcon,
  Helicopter as HelicopterIcon,
  Rocket as RocketIcon,
  Satellite as SatelliteIcon,
  Antenna as AntennaIcon,
  Bluetooth as BluetoothIcon,
  Plug as PlugIcon,
  Power as PowerIcon,
  Lightbulb as LightbulbIcon,
  Tv as TvIcon,
  Laptop as LaptopIcon,
  Tablet as TabletIcon,
  Keyboard as KeyboardIcon,
  Printer as PrinterIcon,
  Speaker as SpeakerIcon,
  Headphones as HeadphonesIcon,
  Microphone as MicrophoneIcon,
  Camera as CameraIcon,
  Video as VideoIcon2,
  Image as ImageIcon2,
  File as FileIcon2,
  Folder as FolderIcon2,
  Archive as ArchiveIcon2,
  Trash2 as Trash2Icon2,
  Edit as EditIcon2,
  Save as SaveIcon2,
  Copy as CopyIcon2,
  Scissors as ScissorsIcon2,
  Clipboard as ClipboardIcon2,
  Music as MusicIcon,
  Film as FilmIcon,
  Gamepad2 as Gamepad2Icon,
  Joystick as JoystickIcon,
  Puzzle as PuzzleIcon,
  Medal as MedalIcon,
  Gem as GemIcon,
  Diamond as DiamondIcon,
  Flame as FlameIcon,
  Snowflake as SnowflakeIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Cloud as CloudIcon,
  CloudRain as CloudRainIcon,
  Wind as WindIcon,
  Droplets as DropletsIcon,
  Timer as TimerIcon,
  Stopwatch as StopwatchIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  SkipBack as SkipBackIcon,
  SkipForward as SkipForwardIcon,
  Volume2 as Volume2Icon,
  VolumeX as VolumeXIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalSessions: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
  };
  userEngagement: {
    dailyActiveUsers: number[];
    weeklyActiveUsers: number[];
    monthlyActiveUsers: number[];
    retentionRate: number;
    churnRate: number;
    userSatisfaction: number;
  };
  performance: {
    pageLoadTime: number;
    apiResponseTime: number;
    errorRate: number;
    uptime: number;
    throughput: number;
    latency: number;
  };
  revenue: {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    averageRevenuePerUser: number;
    lifetimeValue: number;
    conversionFunnel: {
      visitors: number;
      signups: number;
      trials: number;
      conversions: number;
      subscribers: number;
    };
  };
  platform: {
    desktopUsers: number;
    mobileUsers: number;
    tabletUsers: number;
    iosUsers: number;
    androidUsers: number;
    webUsers: number;
  };
  features: {
    simulatorUsage: number;
    swingAnalysisUsage: number;
    tournamentParticipation: number;
    socialInteractions: number;
    multiplayerSessions: number;
  };
}

interface ReportConfig {
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  metrics: string[];
  recipients: string[];
  schedule: string;
  format: 'pdf' | 'csv' | 'excel';
  lastGenerated?: number;
}

interface AdvancedAnalyticsProps {
  data?: AnalyticsData;
  onExport?: (format: 'pdf' | 'csv' | 'excel') => void;
  onGenerateReport?: (config: ReportConfig) => void;
}

export default function AdvancedAnalytics({
  data,
  onExport,
  onGenerateReport
}: AdvancedAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'performance' | 'revenue' | 'platform' | 'features' | 'reports'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [reports, setReports] = useState<ReportConfig[]>([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Mock analytics data
  const mockData: AnalyticsData = {
    overview: {
      totalUsers: 12547,
      activeUsers: 3241,
      totalSessions: 45632,
      avgSessionDuration: 24.5,
      bounceRate: 32.1,
      conversionRate: 8.7
    },
    userEngagement: {
      dailyActiveUsers: [2100, 2350, 1980, 2450, 2670, 2890, 3120, 3241],
      weeklyActiveUsers: [12450, 13200, 13890, 14230],
      monthlyActiveUsers: [45230, 46890, 48750, 51200, 53450, 55890],
      retentionRate: 68.5,
      churnRate: 12.3,
      userSatisfaction: 4.7
    },
    performance: {
      pageLoadTime: 2.3,
      apiResponseTime: 145,
      errorRate: 0.8,
      uptime: 99.7,
      throughput: 1250,
      latency: 89
    },
    revenue: {
      totalRevenue: 245670,
      monthlyRecurringRevenue: 45670,
      averageRevenuePerUser: 19.60,
      lifetimeValue: 156.80,
      conversionFunnel: {
        visitors: 100000,
        signups: 8700,
        trials: 5200,
        conversions: 3040,
        subscribers: 2670
      }
    },
    platform: {
      desktopUsers: 45.2,
      mobileUsers: 38.7,
      tabletUsers: 16.1,
      iosUsers: 28.4,
      androidUsers: 26.3,
      webUsers: 45.3
    },
    features: {
      simulatorUsage: 89.5,
      swingAnalysisUsage: 67.2,
      tournamentParticipation: 34.8,
      socialInteractions: 52.1,
      multiplayerSessions: 23.7
    }
  };

  const analyticsData = data || mockData;

  // Mock reports
  useEffect(() => {
    const mockReports: ReportConfig[] = [
      {
        name: 'Weekly Performance Report',
        type: 'weekly',
        metrics: ['totalUsers', 'activeUsers', 'revenue', 'conversionRate'],
        recipients: ['admin@joesanders.com', 'analytics@stonesgolf.com'],
        schedule: 'Every Monday at 9:00 AM',
        format: 'pdf',
        lastGenerated: Date.now() - 86400000
      },
      {
        name: 'Monthly User Engagement',
        type: 'monthly',
        metrics: ['retentionRate', 'churnRate', 'userSatisfaction', 'sessionDuration'],
        recipients: ['marketing@joesanders.com'],
        schedule: '1st of every month',
        format: 'excel',
        lastGenerated: Date.now() - 259200000
      },
      {
        name: 'Revenue Analytics',
        type: 'weekly',
        metrics: ['totalRevenue', 'monthlyRecurringRevenue', 'averageRevenuePerUser', 'lifetimeValue'],
        recipients: ['finance@stonesgolf.com'],
        schedule: 'Every Friday at 5:00 PM',
        format: 'csv',
        lastGenerated: Date.now() - 172800000
      }
    ];
    setReports(mockReports);
  }, []);

  // Format numbers
  const formatNumber = (num: number, decimals: number = 0) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(decimals) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(decimals) + 'K';
    }
    return num.toFixed(decimals);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return value.toFixed(1) + '%';
  };

  // Get trend indicator
  const getTrendIndicator = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    if (change > 0) {
      return { icon: TrendingUp, color: 'text-green-400', value: `+${change.toFixed(1)}%` };
    } else if (change < 0) {
      return { icon: TrendingDown, color: 'text-red-400', value: `${change.toFixed(1)}%` };
    }
    return { icon: Minus, color: 'text-gray-400', value: '0.0%' };
  };

  // Handle report generation
  const handleGenerateReport = async (config: ReportConfig) => {
    setIsGeneratingReport(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGeneratingReport(false);

    if (onGenerateReport) {
      onGenerateReport(config);
    }

    // Update last generated timestamp
    setReports(prev => prev.map(report =>
      report.name === config.name
        ? { ...report, lastGenerated: Date.now() }
        : report
    ));
  };

  // Export data
  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    if (onExport) {
      onExport(format);
    }
    // Simulate export
    console.log(`Exporting data as ${format.toUpperCase()}`);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-indigo-500" />
        <h3 className="text-xl font-semibold text-white">Advanced Analytics</h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={() => handleExport('pdf')}
              className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-500 transition-colors text-sm"
            >
              <Download className="w-4 h-4 inline mr-1" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-900/50 border border-indigo-500/20 rounded-lg p-1 backdrop-blur-sm">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'performance', label: 'Performance', icon: Zap },
              { id: 'revenue', label: 'Revenue', icon: DollarSign },
              { id: 'platform', label: 'Platform', icon: Monitor },
              { id: 'features', label: 'Features', icon: Target },
              { id: 'reports', label: 'Reports', icon: File }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-500 text-black font-semibold shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">
                    {formatNumber(analyticsData.overview.totalUsers)}
                  </div>
                  <div className="text-sm text-gray-400">Total Users</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+12.5%</span>
                <span className="text-gray-400">vs last month</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-green-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">
                    {formatNumber(analyticsData.overview.activeUsers)}
                  </div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+8.3%</span>
                <span className="text-gray-400">vs last month</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-purple-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">
                    {formatCurrency(analyticsData.revenue.totalRevenue)}
                  </div>
                  <div className="text-sm text-gray-400">Total Revenue</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+15.2%</span>
                <span className="text-gray-400">vs last month</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-orange-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-400">
                    {formatPercentage(analyticsData.overview.conversionRate)}
                  </div>
                  <div className="text-sm text-gray-400">Conversion Rate</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+2.1%</span>
                <span className="text-gray-400">vs last month</span>
              </div>
            </div>
          </div>

          {/* Charts and Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <LineChart className="w-5 h-5 text-indigo-500" />
                <h4 className="text-lg font-semibold text-white">User Growth</h4>
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {analyticsData.userEngagement.dailyActiveUsers.map((value, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div
                      className="bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t w-8 transition-all hover:opacity-80"
                      style={{ height: `${(value / 3500) * 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-400">
                      {new Date(Date.now() - (7 - index) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <PieChart className="w-5 h-5 text-green-500" />
                <h4 className="text-lg font-semibold text-white">Conversion Funnel</h4>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Visitors', value: analyticsData.revenue.conversionFunnel.visitors, color: 'bg-blue-500' },
                  { label: 'Signups', value: analyticsData.revenue.conversionFunnel.signups, color: 'bg-green-500' },
                  { label: 'Trials', value: analyticsData.revenue.conversionFunnel.trials, color: 'bg-yellow-500' },
                  { label: 'Conversions', value: analyticsData.revenue.conversionFunnel.conversions, color: 'bg-orange-500' },
                  { label: 'Subscribers', value: analyticsData.revenue.conversionFunnel.subscribers, color: 'bg-purple-500' }
                ].map((step, index) => (
                  <div key={step.label} className="flex items-center gap-4">
                    <div className="w-20 text-sm text-gray-400">{step.label}</div>
                    <div className="flex-1 bg-gray-700 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${step.color} transition-all`}
                        style={{ width: `${(step.value / analyticsData.revenue.conversionFunnel.visitors) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-16 text-sm text-white text-right">
                      {formatNumber(step.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Gauge className="w-5 h-5 text-cyan-500" />
              <h4 className="text-lg font-semibold text-white">Performance Overview</h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-1">
                  {analyticsData.performance.pageLoadTime}s
                </div>
                <div className="text-sm text-gray-400">Avg Load Time</div>
                <div className="text-xs text-green-400 mt-1">Excellent</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {formatPercentage(analyticsData.performance.uptime)}
                </div>
                <div className="text-sm text-gray-400">Uptime</div>
                <div className="text-xs text-green-400 mt-1">Reliable</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {analyticsData.performance.apiResponseTime}ms
                </div>
                <div className="text-sm text-gray-400">API Response</div>
                <div className="text-xs text-yellow-400 mt-1">Good</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">
                  {formatPercentage(analyticsData.performance.errorRate)}
                </div>
                <div className="text-sm text-gray-400">Error Rate</div>
                <div className="text-xs text-green-400 mt-1">Low</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Metrics */}
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">User Engagement</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Retention Rate</span>
                  <span className="text-blue-400 font-semibold">
                    {formatPercentage(analyticsData.userEngagement.retentionRate)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Churn Rate</span>
                  <span className="text-red-400 font-semibold">
                    {formatPercentage(analyticsData.userEngagement.churnRate)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">User Satisfaction</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 font-semibold">
                      {analyticsData.userEngagement.userSatisfaction}
                    </span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Avg Session</span>
                  <span className="text-green-400 font-semibold">
                    {analyticsData.overview.avgSessionDuration}m
                  </span>
                </div>
              </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <BarChart className="w-5 h-5 text-blue-500" />
                <h4 className="text-lg font-semibold text-white">Monthly Active Users</h4>
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {analyticsData.userEngagement.monthlyActiveUsers.map((value, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div
                      className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t w-8 transition-all hover:opacity-80"
                      style={{ height: `${(value / 60000) * 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-400">
                      {new Date(Date.now() - (5 - index) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Segments */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">User Segments</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-5 h-5 text-green-500" />
                  <span className="text-white font-semibold">Premium Users</span>
                </div>
                <div className="text-2xl font-bold text-green-400 mb-1">2,341</div>
                <div className="text-sm text-gray-400">18.7% of total users</div>
              </div>

              <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-white font-semibold">Active Players</span>
                </div>
                <div className="text-2xl font-bold text-blue-400 mb-1">8,456</div>
                <div className="text-sm text-gray-400">67.4% of total users</div>
              </div>

              <div className="bg-gradient-to-r from-gray-900/20 to-gray-800/20 border border-gray-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-white font-semibold">Inactive Users</span>
                </div>
                <div className="text-2xl font-bold text-gray-400 mb-1">1,750</div>
                <div className="text-sm text-gray-400">14.0% of total users</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Server className="w-8 h-8 text-green-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">
                    {formatPercentage(analyticsData.performance.uptime)}
                  </div>
                  <div className="text-sm text-gray-400">System Uptime</div>
                </div>
              </div>
              <div className="text-sm text-green-400">Excellent reliability</div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-blue-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">
                    {analyticsData.performance.pageLoadTime}s
                  </div>
                  <div className="text-sm text-gray-400">Page Load Time</div>
                </div>
              </div>
              <div className="text-sm text-blue-400">Fast loading</div>
            </div>

            <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Database className="w-8 h-8 text-yellow-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-400">
                    {analyticsData.performance.apiResponseTime}ms
                  </div>
                  <div className="text-sm text-gray-400">API Response</div>
                </div>
              </div>
              <div className="text-sm text-yellow-400">Good performance</div>
            </div>

            <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-400">
                    {formatPercentage(analyticsData.performance.errorRate)}
                  </div>
                  <div className="text-sm text-gray-400">Error Rate</div>
                </div>
              </div>
              <div className="text-sm text-green-400">Very low errors</div>
            </div>
          </div>

          {/* System Metrics */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">System Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Cpu className="w-6 h-6 text-cyan-500 mr-2" />
                  <span className="text-white font-semibold">CPU Usage</span>
                </div>
                <div className="text-3xl font-bold text-cyan-400 mb-1">45%</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <MemoryStick className="w-6 h-6 text-purple-500 mr-2" />
                  <span className="text-white font-semibold">Memory Usage</span>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-1">67%</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <HardDrive className="w-6 h-6 text-green-500 mr-2" />
                  <span className="text-white font-semibold">Storage Usage</span>
                </div>
                <div className="text-3xl font-bold text-green-400 mb-1">23%</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-green-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">
                    {formatCurrency(analyticsData.revenue.totalRevenue)}
                  </div>
                  <div className="text-sm text-gray-400">Total Revenue</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+15.2%</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <RefreshCw className="w-8 h-8 text-blue-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">
                    {formatCurrency(analyticsData.revenue.monthlyRecurringRevenue)}
                  </div>
                  <div className="text-sm text-gray-400">MRR</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+8.7%</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <User className="w-8 h-8 text-purple-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">
                    {formatCurrency(analyticsData.revenue.averageRevenuePerUser)}
                  </div>
                  <div className="text-sm text-gray-400">ARPU</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+5.3%</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Crown className="w-8 h-8 text-orange-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-400">
                    {formatCurrency(analyticsData.revenue.lifetimeValue)}
                  </div>
                  <div className="text-sm text-gray-400">LTV</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+12.1%</span>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Revenue Sources</h4>
              <div className="space-y-3">
                {[
                  { source: 'Premium Subscriptions', amount: 145670, percentage: 59.2, color: 'bg-purple-500' },
                  { source: 'Tournament Fees', amount: 45670, percentage: 18.6, color: 'bg-blue-500' },
                  { source: 'Merchandise Sales', amount: 34230, percentage: 13.9, color: 'bg-green-500' },
                  { source: 'Advertising', amount: 20100, percentage: 8.2, color: 'bg-yellow-500' }
                ].map((item) => (
                  <div key={item.source} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-gray-400">{item.source}</div>
                    <div className="flex-1 bg-gray-700 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${item.color} transition-all`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-20 text-sm text-white text-right">
                      {formatCurrency(item.amount)}
                    </div>
                    <div className="w-12 text-sm text-gray-400 text-right">
                      {item.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Conversion Funnel</h4>
              <div className="space-y-4">
                {[
                  { stage: 'Website Visitors', count: 100000, rate: 100 },
                  { stage: 'Free Trial Signups', count: 8700, rate: 8.7 },
                  { stage: 'Active Trials', count: 5200, rate: 5.2 },
                  { stage: 'Paid Conversions', count: 3040, rate: 3.0 },
                  { stage: 'Active Subscribers', count: 2670, rate: 2.7 }
                ].map((stage, index) => (
                  <div key={stage.stage} className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="flex-1">
                      <div className="text-white font-semibold">{stage.stage}</div>
                      <div className="text-sm text-gray-400">
                        {formatNumber(stage.count)} users ({stage.rate}%)
                      </div>
                    </div>
                    {index > 0 && (
                      <div className="text-sm text-gray-400">
                        {((stage.count / 100000) * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Platform Tab */}
      {activeTab === 'platform' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Device Types */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Device Types</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Monitor className="w-8 h-8 text-blue-500" />
                  <div className="flex-1">
                    <div className="text-white font-semibold">Desktop</div>
                    <div className="text-sm text-gray-400">Laptops and computers</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">
                      {formatPercentage(analyticsData.platform.desktopUsers)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Smartphone className="w-8 h-8 text-green-500" />
                  <div className="flex-1">
                    <div className="text-white font-semibold">Mobile</div>
                    <div className="text-sm text-gray-400">Smartphones and tablets</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">
                      {formatPercentage(analyticsData.platform.mobileUsers)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Tablet className="w-8 h-8 text-purple-500" />
                  <div className="flex-1">
                    <div className="text-white font-semibold">Tablet</div>
                    <div className="text-sm text-gray-400">iPad and Android tablets</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">
                      {formatPercentage(analyticsData.platform.tabletUsers)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Systems */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Operating Systems</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">iOS</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">iOS</div>
                    <div className="text-sm text-gray-400">iPhone and iPad</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">
                      {formatPercentage(analyticsData.platform.iosUsers)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">Android</div>
                    <div className="text-sm text-gray-400">Android devices</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">
                      {formatPercentage(analyticsData.platform.androidUsers)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Globe className="w-8 h-8 text-purple-500" />
                  <div className="flex-1">
                    <div className="text-white font-semibold">Web</div>
                    <div className="text-sm text-gray-400">Browser access</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">
                      {formatPercentage(analyticsData.platform.webUsers)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Top Countries</h4>
            <div className="space-y-3">
              {[
                { country: 'United States', users: 4521, percentage: 36.1 },
                { country: 'United Kingdom', users: 1234, percentage: 9.9 },
                { country: 'Canada', users: 987, percentage: 7.9 },
                { country: 'Australia', users: 756, percentage: 6.0 },
                { country: 'Germany', users: 543, percentage: 4.3 },
                { country: 'France', users: 432, percentage: 3.4 },
                { country: 'Japan', users: 321, percentage: 2.6 },
                { country: 'Others', users: 2753, percentage: 22.0 }
              ].map((item) => (
                <div key={item.country} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-400">{item.country}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-sm text-white text-right">
                    {formatNumber(item.users)}
                  </div>
                  <div className="w-12 text-sm text-gray-400 text-right">
                    {item.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Gamepad2 className="w-8 h-8 text-blue-500" />
                <div>
                  <h4 className="text-lg font-semibold text-white">3D Simulator</h4>
                  <p className="text-sm text-gray-400">Practice shots in immersive 3D</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {formatPercentage(analyticsData.features.simulatorUsage)}
              </div>
              <div className="text-sm text-gray-400">Usage rate</div>
            </div>

            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Camera className="w-8 h-8 text-green-500" />
                <div>
                  <h4 className="text-lg font-semibold text-white">Swing Analysis</h4>
                  <p className="text-sm text-gray-400">AI-powered swing feedback</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {formatPercentage(analyticsData.features.swingAnalysisUsage)}
              </div>
              <div className="text-sm text-gray-400">Usage rate</div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-purple-500" />
                <div>
                  <h4 className="text-lg font-semibold text-white">Tournaments</h4>
                  <p className="text-sm text-gray-400">Competitive gameplay</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {formatPercentage(analyticsData.features.tournamentParticipation)}
              </div>
              <div className="text-sm text-gray-400">Participation rate</div>
            </div>

            <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-orange-500" />
                <div>
                  <h4 className="text-lg font-semibold text-white">Social Features</h4>
                  <p className="text-sm text-gray-400">Friends and challenges</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {formatPercentage(analyticsData.features.socialInteractions)}
              </div>
              <div className="text-sm text-gray-400">Engagement rate</div>
            </div>

            <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-cyan-500" />
                <div>
                  <h4 className="text-lg font-semibold text-white">Multiplayer</h4>
                  <p className="text-sm text-gray-400">Real-time competitive matches</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                {formatPercentage(analyticsData.features.multiplayerSessions)}
              </div>
              <div className="text-sm text-gray-400">Session rate</div>
            </div>

            <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-yellow-500" />
                <div>
                  <h4 className="text-lg font-semibold text-white">Learning Paths</h4>
                  <p className="text-sm text-gray-400">Personalized coaching</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">42.3%</div>
              <div className="text-sm text-gray-400">Completion rate</div>
            </div>
          </div>

          {/* Feature Usage Trends */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Feature Usage Trends</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-white font-semibold mb-3">Most Popular Features</h5>
                <div className="space-y-2">
                  {[
                    { feature: '3D Simulator', usage: 89.5, trend: 'up' },
                    { feature: 'Swing Analysis', usage: 67.2, trend: 'up' },
                    { feature: 'Social Features', usage: 52.1, trend: 'up' },
                    { feature: 'Tournaments', usage: 34.8, trend: 'up' },
                    { feature: 'Multiplayer', usage: 23.7, trend: 'stable' }
                  ].map((item) => (
                    <div key={item.feature} className="flex items-center justify-between">
                      <span className="text-gray-400">{item.feature}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{item.usage}%</span>
                        <TrendingUp className={`w-4 h-4 ${
                          item.trend === 'up' ? 'text-green-400' :
                          item.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-white font-semibold mb-3">Feature Satisfaction</h5>
                <div className="space-y-2">
                  {[
                    { feature: '3D Simulator', rating: 4.8 },
                    { feature: 'Swing Analysis', rating: 4.6 },
                    { feature: 'Learning Paths', rating: 4.5 },
                    { feature: 'Tournaments', rating: 4.3 },
                    { feature: 'Social Features', rating: 4.2 },
                    { feature: 'Multiplayer', rating: 4.1 }
                  ].map((item) => (
                    <div key={item.feature} className="flex items-center justify-between">
                      <span className="text-gray-400">{item.feature}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-white font-semibold">{item.rating}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold text-white">Automated Reports</h4>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 transition-colors">
              <Plus className="w-4 h-4 inline mr-2" />
              Create Report
            </button>
          </div>

          {/* Existing Reports */}
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.name} className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h5 className="text-lg font-semibold text-white">{report.name}</h5>
                    <p className="text-gray-400 text-sm">{report.schedule}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      report.format === 'pdf' ? 'bg-red-900/20 text-red-400' :
                      report.format === 'excel' ? 'bg-green-900/20 text-green-400' :
                      'bg-blue-900/20 text-blue-400'
                    }`}>
                      {report.format.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleGenerateReport(report)}
                      disabled={isGeneratingReport}
                      className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-500 transition-colors text-sm disabled:opacity-50"
                    >
                      {isGeneratingReport ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h6 className="text-white font-semibold mb-2">Metrics Included</h6>
                    <div className="flex flex-wrap gap-2">
                      {report.metrics.map((metric) => (
                        <span key={metric} className="bg-indigo-900/20 text-indigo-400 px-2 py-1 rounded text-sm">
                          {metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h6 className="text-white font-semibold mb-2">Recipients</h6>
                    <div className="space-y-1">
                      {report.recipients.map((recipient) => (
                        <div key={recipient} className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 text-sm">{recipient}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {report.lastGenerated && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Last generated: {new Date(report.lastGenerated).toLocaleString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Report Templates */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Report Templates</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                  <span className="text-white font-semibold">Performance Report</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">System performance, uptime, and user metrics</p>
                <button className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-500 transition-colors text-sm">
                  Use Template
                </button>
              </div>

              <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-6 h-6 text-green-500" />
                  <span className="text-white font-semibold">Revenue Report</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">Financial metrics, conversion rates, and ROI</p>
                <button className="w-full bg-green-600 text-white px-3 py-2 rounded hover:bg-green-500 transition-colors text-sm">
                  Use Template
                </button>
              </div>

              <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-purple-500" />
                  <span className="text-white font-semibold">User Analytics</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">User behavior, engagement, and retention</p>
                <button className="w-full bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-500 transition-colors text-sm">
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>📊 <strong>Advanced Analytics:</strong> Real-time insights • Automated reports • Performance monitoring</p>
        <p className="mt-1">📱 <strong>Mobile App:</strong> React Native • Cross-platform • Native features</p>
      </div>
    </div>
  );
}
