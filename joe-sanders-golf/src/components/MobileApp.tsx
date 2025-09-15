'use client';
import { useState, useEffect } from 'react';
import {
  Smartphone,
  Tablet,
  Download,
  Play,
  Settings,
  Bell,
  Camera,
  Mic,
  Volume2,
  Battery,
  Wifi,
  Bluetooth,
  MapPin,
  Navigation,
  Trophy,
  Users,
  Gamepad2,
  Zap,
  Star,
  Heart,
  Share,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Award,
  Crown,
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  X,
  Check,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Octagon,
  Home,
  Search,
  User,
  Menu,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  MoreVertical,
  Edit,
  Save,
  Copy,
  Scissors,
  Clipboard,
  Music,
  Film,
  Headphones,
  Speaker,
  Video,
  Image,
  File,
  Folder,
  Archive,
  Trash2,
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
  Plug,
  Power,
  Lightbulb,
  Tv,
  Laptop,
  Keyboard,
  Printer,
  Mouse,
  Monitor,
  HardDrive,
  Cpu,
  MemoryStick,
  Database,
  Server,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  Sun,
  Moon,
  Thermometer,
  Gauge,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  AreaChart,
  ScatterChart,
  Radar,
  Timer,
  Stopwatch,
  Play as PlayIcon,
  Pause,
  SkipBack,
  SkipForward,
  VolumeX,
  Mic as MicIcon,
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
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ChevronDown,
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
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  RefreshCw as RefreshCwIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  Info as InfoIcon,
  HelpCircle as HelpCircleIcon,
  Home as HomeIcon,
  Search as SearchIcon2,
  User as UserIcon,
  Menu as MenuIcon,
  Grid3X3 as Grid3X3Icon,
  List as ListIcon,
  Filter as FilterIcon2,
  SortAsc as SortAscIcon2,
  SortDesc as SortDescIcon2,
  MoreHorizontal as MoreHorizontalIcon,
  MoreVertical as MoreVerticalIcon,
  Edit as EditIcon2,
  Save as SaveIcon2,
  Copy as CopyIcon2,
  Scissors as ScissorsIcon2,
  Clipboard as ClipboardIcon2,
  Music as MusicIcon,
  Film as FilmIcon,
  Headphones as HeadphonesIcon,
  Speaker as SpeakerIcon,
  Video as VideoIcon2,
  Image as ImageIcon2,
  File as FileIcon2,
  Folder as FolderIcon2,
  Archive as ArchiveIcon2,
  Trash2 as Trash2Icon2,
  Package as PackageIcon2,
  Truck as TruckIcon2,
  Car as CarIcon2,
  Bike as BikeIcon2,
  Plane as PlaneIcon2,
  Ship as ShipIcon2,
  Train as TrainIcon2,
  Bus as BusIcon2,
  Taxi as TaxiIcon2,
  Ambulance as AmbulanceIcon2,
  FireTruck as FireTruckIcon2,
  Police as PoliceIcon2,
  Helicopter as HelicopterIcon2,
  Rocket as RocketIcon2,
  Satellite as SatelliteIcon2,
  Antenna as AntennaIcon2,
  Plug as PlugIcon2,
  Power as PowerIcon2,
  Lightbulb as LightbulbIcon2,
  Tv as TvIcon2,
  Laptop as LaptopIcon2,
  Keyboard as KeyboardIcon2,
  Printer as PrinterIcon2,
  Mouse as MouseIcon2,
  Monitor as MonitorIcon2,
  HardDrive as HardDriveIcon2,
  Cpu as CpuIcon2,
  MemoryStick as MemoryStickIcon2,
  Database as DatabaseIcon2,
  Server as ServerIcon2,
  Cloud as CloudIcon2,
  CloudRain as CloudRainIcon2,
  Wind as WindIcon2,
  Droplets as DropletsIcon2,
  Sun as SunIcon2,
  Moon as MoonIcon2,
  Thermometer as ThermometerIcon2,
  Gauge as GaugeIcon2,
  Activity as ActivityIcon2,
  BarChart3 as BarChart3Icon2,
  PieChart as PieChartIcon2,
  LineChart as LineChartIcon2,
  AreaChart as AreaChartIcon2,
  ScatterChart as ScatterChartIcon2,
  Radar as RadarIcon2,
  Timer as TimerIcon2,
  Stopwatch as StopwatchIcon2,
  Play as PlayIcon2,
  Pause as PauseIcon2,
  SkipBack as SkipBackIcon2,
  SkipForward as SkipForwardIcon2,
  Volume2 as Volume2Icon2,
  VolumeX as VolumeXIcon2,
  Mic as MicIcon2,
  MicOff as MicOffIcon2
} from 'lucide-react';

interface MobileAppConfig {
  appName: string;
  version: string;
  buildNumber: number;
  platform: 'ios' | 'android' | 'both';
  targetSdk: string;
  minSdk: string;
  bundleId: string;
  features: string[];
  permissions: string[];
  dependencies: Array<{ name: string; version: string; type: 'native' | 'javascript' }>;
}

interface AppStoreInfo {
  ios: {
    appStoreId: string;
    version: string;
    rating: number;
    reviews: number;
    downloads: string;
    lastUpdated: string;
  };
  android: {
    packageName: string;
    version: string;
    rating: number;
    reviews: number;
    downloads: string;
    lastUpdated: string;
  };
}

interface MobileAppProps {
  config?: MobileAppConfig;
  onBuild?: (platform: 'ios' | 'android' | 'both') => void;
  onDeploy?: (platform: 'ios' | 'android' | 'both') => void;
}

export default function MobileApp({
  config,
  onBuild,
  onDeploy
}: MobileAppProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'build' | 'deploy' | 'analytics'>('overview');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState<'ios' | 'android' | 'both'>('both');

  // Mock mobile app configuration
  const mockConfig: MobileAppConfig = {
    appName: 'Joe Sanders Golf Simulator',
    version: '2.1.0',
    buildNumber: 142,
    platform: 'both',
    targetSdk: 'API 34',
    minSdk: 'API 24',
    bundleId: 'com.joesanders.golf',
    features: [
      '3D Golf Simulation',
      'AI Swing Analysis',
      'Real-time Multiplayer',
      'Tournament System',
      'Social Features',
      'Offline Mode',
      'Push Notifications',
      'Camera Integration',
      'GPS Location Services',
      'Voice Commands',
      'Haptic Feedback',
      'Dark Mode Support'
    ],
    permissions: [
      'Camera',
      'Microphone',
      'Location',
      'Storage',
      'Notifications',
      'Bluetooth',
      'Internet',
      'Vibration'
    ],
    dependencies: [
      { name: 'React Native', version: '0.73.0', type: 'javascript' },
      { name: 'React Native Reanimated', version: '3.6.0', type: 'javascript' },
      { name: 'React Native Gesture Handler', version: '2.14.0', type: 'javascript' },
      { name: 'React Native Camera', version: '4.2.1', type: 'native' },
      { name: 'React Native Maps', version: '1.8.0', type: 'native' },
      { name: 'React Native Push Notification', version: '8.1.1', type: 'native' },
      { name: 'React Native Voice', version: '3.2.4', type: 'native' },
      { name: 'React Native Sensors', version: '7.3.6', type: 'native' },
      { name: 'React Native WebRTC', version: '118.0.0', type: 'native' },
      { name: 'Three.js', version: '0.158.0', type: 'javascript' },
      { name: '@react-three/fiber', version: '8.15.0', type: 'javascript' },
      { name: '@react-three/drei', version: '9.88.0', type: 'javascript' }
    ]
  };

  // Mock app store information
  const appStoreInfo: AppStoreInfo = {
    ios: {
      appStoreId: 'id6471234567',
      version: '2.1.0',
      rating: 4.8,
      reviews: 1247,
      downloads: '50K+',
      lastUpdated: '2024-09-10'
    },
    android: {
      packageName: 'com.joesanders.golf',
      version: '2.1.0',
      rating: 4.7,
      reviews: 2156,
      downloads: '100K+',
      lastUpdated: '2024-09-10'
    }
  };

  const mobileConfig = config || mockConfig;

  // Handle build process
  const handleBuild = async (platform: 'ios' | 'android' | 'both') => {
    setIsBuilding(true);
    setBuildProgress(0);
    setSelectedPlatform(platform);

    // Simulate build process
    const buildSteps = [
      'Initializing build environment...',
      'Installing dependencies...',
      'Configuring native modules...',
      'Building JavaScript bundle...',
      'Compiling native code...',
      'Creating app bundle...',
      'Signing and packaging...',
      'Build completed successfully!'
    ];

    for (let i = 0; i < buildSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBuildProgress(((i + 1) / buildSteps.length) * 100);
    }

    setIsBuilding(false);

    if (onBuild) {
      onBuild(platform);
    }
  };

  // Handle deployment
  const handleDeploy = (platform: 'ios' | 'android' | 'both') => {
    if (onDeploy) {
      onDeploy(platform);
    }
    // Simulate deployment
    console.log(`Deploying to ${platform} app store`);
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Smartphone className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-semibold text-white">Mobile App Development</h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">v{mobileConfig.version}</span>
            <span className="px-2 py-1 bg-green-900/20 text-green-400 rounded text-xs font-semibold">
              Build #{mobileConfig.buildNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-900/50 border border-blue-500/20 rounded-lg p-1 backdrop-blur-sm">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'features', label: 'Features', icon: Settings },
              { id: 'build', label: 'Build', icon: Package },
              { id: 'deploy', label: 'Deploy', icon: Upload },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-black font-semibold shadow-lg'
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
          {/* App Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">App Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">App Name</span>
                  <span className="text-white font-semibold">{mobileConfig.appName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Version</span>
                  <span className="text-white font-semibold">{mobileConfig.version}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Bundle ID</span>
                  <span className="text-white font-semibold text-sm">{mobileConfig.bundleId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Platform</span>
                  <span className="text-white font-semibold">{mobileConfig.platform}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Target SDK</span>
                  <span className="text-white font-semibold">{mobileConfig.targetSdk}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Min SDK</span>
                  <span className="text-white font-semibold">{mobileConfig.minSdk}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">App Store Status</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">iOS</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">App Store</div>
                      <div className="text-sm text-gray-400">Version {appStoreInfo.ios.version}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{appStoreInfo.ios.rating}</span>
                    </div>
                    <div className="text-sm text-gray-400">{appStoreInfo.ios.downloads} downloads</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Google Play</div>
                      <div className="text-sm text-gray-400">Version {appStoreInfo.android.version}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{appStoreInfo.android.rating}</span>
                    </div>
                    <div className="text-sm text-gray-400">{appStoreInfo.android.downloads} downloads</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Key Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mobileConfig.features.slice(0, 6).map((feature, index) => (
                <div key={feature} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white text-sm">{feature}</span>
                </div>
              ))}
              {mobileConfig.features.length > 6 && (
                <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-white text-sm">+{mobileConfig.features.length - 6} more features</span>
                </div>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Download className="w-8 h-8 text-green-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">150K+</div>
                  <div className="text-sm text-gray-400">Total Downloads</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+12.5%</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Star className="w-8 h-8 text-blue-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">4.75</div>
                  <div className="text-sm text-gray-400">Avg Rating</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+0.2</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-purple-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">89.2%</div>
                  <div className="text-sm text-gray-400">Retention Rate</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+5.1%</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-orange-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-400">4.2m</div>
                  <div className="text-sm text-gray-400">Avg Session</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+8.3%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Core Features */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Core Features</h4>
              <div className="space-y-3">
                {[
                  { name: '3D Golf Simulation', icon: Gamepad2, status: 'completed' },
                  { name: 'AI Swing Analysis', icon: Camera, status: 'completed' },
                  { name: 'Real-time Multiplayer', icon: Users, status: 'completed' },
                  { name: 'Tournament System', icon: Trophy, status: 'completed' },
                  { name: 'Social Features', icon: MessageCircle, status: 'completed' },
                  { name: 'Offline Mode', icon: Download, status: 'in-progress' }
                ].map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.name} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-blue-400" />
                        <span className="text-white">{feature.name}</span>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        feature.status === 'completed'
                          ? 'bg-green-900/20 text-green-400'
                          : feature.status === 'in-progress'
                          ? 'bg-yellow-900/20 text-yellow-400'
                          : 'bg-gray-900/20 text-gray-400'
                      }`}>
                        {feature.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Native Features */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Native Features</h4>
              <div className="space-y-3">
                {[
                  { name: 'Push Notifications', icon: Bell, status: 'completed' },
                  { name: 'Camera Integration', icon: Camera, status: 'completed' },
                  { name: 'GPS Location', icon: MapPin, status: 'completed' },
                  { name: 'Voice Commands', icon: Mic, status: 'in-progress' },
                  { name: 'Haptic Feedback', icon: Smartphone, status: 'completed' },
                  { name: 'Dark Mode', icon: Moon, status: 'completed' }
                ].map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.name} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-purple-400" />
                        <span className="text-white">{feature.name}</span>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        feature.status === 'completed'
                          ? 'bg-green-900/20 text-green-400'
                          : feature.status === 'in-progress'
                          ? 'bg-yellow-900/20 text-yellow-400'
                          : 'bg-gray-900/20 text-gray-400'
                      }`}>
                        {feature.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Required Permissions</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mobileConfig.permissions.map((permission) => (
                <div key={permission} className="flex items-center gap-2 p-3 bg-gray-700/30 rounded-lg">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">{permission}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Build Tab */}
      {activeTab === 'build' && (
        <div className="space-y-6">
          {/* Build Configuration */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Build Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Target Platform</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value as any)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="ios">iOS Only</option>
                  <option value="android">Android Only</option>
                  <option value="both">Both Platforms</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Build Type</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none">
                  <option value="debug">Debug</option>
                  <option value="release">Release</option>
                  <option value="staging">Staging</option>
                </select>
              </div>
            </div>
          </div>

          {/* Build Progress */}
          {isBuilding && (
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Build Progress</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Building for {selectedPlatform}</span>
                  <span className="text-blue-400">{Math.round(buildProgress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${buildProgress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-400">
                  {buildProgress < 20 && 'Initializing build environment...'}
                  {buildProgress >= 20 && buildProgress < 40 && 'Installing dependencies...'}
                  {buildProgress >= 40 && buildProgress < 60 && 'Configuring native modules...'}
                  {buildProgress >= 60 && buildProgress < 80 && 'Building JavaScript bundle...'}
                  {buildProgress >= 80 && buildProgress < 100 && 'Compiling native code...'}
                  {buildProgress >= 100 && 'Build completed successfully!'}
                </div>
              </div>
            </div>
          )}

          {/* Build Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => handleBuild('ios')}
              disabled={isBuilding}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">iOS</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Build iOS</div>
                  <div className="text-sm opacity-90">Xcode 15.0+</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleBuild('android')}
              disabled={isBuilding}
              className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 rounded-lg hover:from-green-500 hover:to-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Build Android</div>
                  <div className="text-sm opacity-90">Android 8.0+</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleBuild('both')}
              disabled={isBuilding}
              className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-4 rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-3">
                <Smartphone className="w-8 h-8" />
                <div className="text-left">
                  <div className="font-semibold">Build Both</div>
                  <div className="text-sm opacity-90">Cross-platform</div>
                </div>
              </div>
            </button>
          </div>

          {/* Dependencies */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Key Dependencies</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mobileConfig.dependencies.slice(0, 8).map((dep) => (
                <div key={dep.name} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div>
                    <div className="text-white font-semibold">{dep.name}</div>
                    <div className="text-sm text-gray-400">v{dep.version}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    dep.type === 'native'
                      ? 'bg-blue-900/20 text-blue-400'
                      : 'bg-green-900/20 text-green-400'
                  }`}>
                    {dep.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Deploy Tab */}
      {activeTab === 'deploy' && (
        <div className="space-y-6">
          {/* Deployment Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">iOS</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">App Store Connect</h4>
                  <p className="text-sm text-gray-400">Deploy to Apple App Store</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Current Version</span>
                  <span className="text-white font-semibold">{appStoreInfo.ios.version}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 font-semibold">Ready for Review</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Last Updated</span>
                  <span className="text-white font-semibold">{appStoreInfo.ios.lastUpdated}</span>
                </div>
              </div>

              <button
                onClick={() => handleDeploy('ios')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors"
              >
                Deploy to App Store
              </button>
            </div>

            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Google Play Console</h4>
                  <p className="text-sm text-gray-400">Deploy to Google Play Store</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Current Version</span>
                  <span className="text-white font-semibold">{appStoreInfo.android.version}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 font-semibold">Ready for Production</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Last Updated</span>
                  <span className="text-white font-semibold">{appStoreInfo.android.lastUpdated}</span>
                </div>
              </div>

              <button
                onClick={() => handleDeploy('android')}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition-colors"
              >
                Deploy to Play Store
              </button>
            </div>
          </div>

          {/* Deployment Checklist */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Pre-deployment Checklist</h4>
            <div className="space-y-3">
              {[
                { task: 'App Store screenshots prepared', status: 'completed' },
                { task: 'App description and metadata updated', status: 'completed' },
                { task: 'Privacy policy compliant', status: 'completed' },
                { task: 'Beta testing completed', status: 'completed' },
                { task: 'Crash reporting configured', status: 'completed' },
                { task: 'Analytics tracking enabled', status: 'completed' },
                { task: 'In-app purchase setup', status: 'in-progress' },
                { task: 'Push notification certificates', status: 'completed' }
              ].map((item) => (
                <div key={item.task} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <span className="text-white">{item.task}</span>
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.status === 'completed'
                      ? 'bg-green-900/20 text-green-400'
                      : item.status === 'in-progress'
                      ? 'bg-yellow-900/20 text-yellow-400'
                      : 'bg-gray-900/20 text-gray-400'
                  }`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Mobile App Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Download className="w-8 h-8 text-blue-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">150K+</div>
                  <div className="text-sm text-gray-400">App Downloads</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+12.5%</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-green-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">45.2K</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+8.3%</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-purple-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">4.2m</div>
                  <div className="text-sm text-gray-400">Avg Session</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+15.2%</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Star className="w-8 h-8 text-orange-500" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-400">4.75</div>
                  <div className="text-sm text-gray-400">Avg Rating</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+0.2</span>
              </div>
            </div>
          </div>

          {/* Platform Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Platform Performance</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">iOS</span>
                    </div>
                    <span className="text-white">iOS Users</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-400">68.4K</div>
                    <div className="text-sm text-gray-400">45.6% of total</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <span className="text-white">Android Users</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-400">81.6K</div>
                    <div className="text-sm text-gray-400">54.4% of total</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Top Features Used</h4>
              <div className="space-y-3">
                {[
                  { feature: '3D Simulator', usage: 89.5, color: 'bg-blue-500' },
                  { feature: 'Swing Analysis', usage: 67.2, color: 'bg-green-500' },
                  { feature: 'Tournaments', usage: 45.8, color: 'bg-purple-500' },
                  { feature: 'Social Feed', usage: 34.2, color: 'bg-orange-500' },
                  { feature: 'Offline Mode', usage: 23.7, color: 'bg-yellow-500' }
                ].map((item) => (
                  <div key={item.feature} className="flex items-center gap-4">
                    <div className="w-20 text-sm text-gray-400">{item.feature}</div>
                    <div className="flex-1 bg-gray-700 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${item.color} transition-all`}
                        style={{ width: `${item.usage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm text-white text-right">
                      {item.usage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Crash Reports & Issues */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">App Health</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">99.7%</div>
                <div className="text-sm text-gray-400">Crash-free Rate</div>
                <div className="text-xs text-green-400 mt-1">Excellent</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">1.2s</div>
                <div className="text-sm text-gray-400">Avg Load Time</div>
                <div className="text-xs text-blue-400 mt-1">Fast</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">4.8</div>
                <div className="text-sm text-gray-400">App Rating</div>
                <div className="text-xs text-yellow-400 mt-1">Very Good</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>📱 <strong>Mobile App:</strong> React Native • Cross-platform • Native features</p>
        <p className="mt-1">🚀 <strong>Deployment:</strong> App Store • Play Store • Enterprise distribution</p>
      </div>
    </div>
  );
}