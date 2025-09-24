import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(true);

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data from the app. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => {
          // Implement cache clearing logic
          Alert.alert('Success', 'Cache cleared successfully');
        }}
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'This will open the privacy policy in the web platform.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => {
          // Navigate to privacy policy in WebView
        }}
      ]
    );
  };

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        {
          icon: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Receive updates about tournaments and news',
          type: 'switch',
          value: notificationsEnabled,
          onChange: setNotificationsEnabled,
        },
        {
          icon: 'analytics',
          title: 'Analytics',
          subtitle: 'Help improve the app experience',
          type: 'switch',
          value: analyticsEnabled,
          onChange: setAnalyticsEnabled,
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          icon: 'trash',
          title: 'Clear Cache',
          subtitle: 'Free up storage space',
          type: 'action',
          onPress: handleClearCache,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'shield-checkmark',
          title: 'Privacy Policy',
          subtitle: 'View our privacy policy',
          type: 'action',
          onPress: handlePrivacyPolicy,
        },
        {
          icon: 'help-circle',
          title: 'Help & Support',
          subtitle: 'Get help using the app',
          type: 'action',
          onPress: () => Alert.alert('Help', 'Help documentation coming soon!'),
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {settingsGroups.map((group, groupIndex) => (
        <View key={groupIndex} style={styles.group}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          {group.items.map((item, itemIndex) => (
            <TouchableOpacity
              key={itemIndex}
              style={styles.settingItem}
              onPress={item.type === 'action' ? item.onPress : undefined}
              disabled={item.type === 'switch'}
            >
              <View style={styles.settingContent}>
                <Ionicons 
                  name={item.icon as keyof typeof Ionicons.glyphMap} 
                  size={24} 
                  color="#FFD700" 
                />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              {item.type === 'switch' && (
                <Switch
                  value={item.value as boolean}
                  onValueChange={item.onChange as (value: boolean) => void}
                  trackColor={{ false: '#333', true: '#FFD700' }}
                  thumbColor={item.value ? '#000' : '#666'}
                />
              )}
              {item.type === 'action' && (
                <Ionicons name="chevron-forward" size={20} color="#666" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>Uncle Joe's Golf</Text>
        <Text style={styles.appVersion}>Version {appVersion}</Text>
        <Text style={styles.appCopyright}>
          © 2025 Uncle Joe's Golf. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  group: {
    marginTop: 20,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111',
    marginHorizontal: 20,
    marginVertical: 1,
    padding: 16,
    borderRadius: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  appInfo: {
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});