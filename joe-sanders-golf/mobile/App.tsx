import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import CameraScreen from './src/screens/CameraScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Services
import { AnalyticsBridge } from './src/services/AnalyticsBridge';
import { NotificationManager } from './src/services/NotificationManager';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: "Uncle Joe's Golf" }}
      />
      <Stack.Screen 
        name="WebView" 
        component={WebViewScreen}
        options={{ title: "Golf Platform" }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Camera') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFD700', // Joe Gold
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#000000', // Joe Black
          borderTopColor: '#FFD700',
        },
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#FFD700',
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack}
        options={{ 
          title: 'Home',
          headerShown: false 
        }}
      />
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen}
        options={{ title: 'Swing Analysis' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  React.useEffect(() => {
    // Initialize services
    AnalyticsBridge.initialize();
    NotificationManager.initialize();
  }, []);

  return (
    <NavigationContainer>
      <MainTabs />
      <StatusBar style="light" backgroundColor="#000000" />
    </NavigationContainer>
  );
}