import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { notificationManager } from '../services/NotificationManager';
import { analyticsBridge } from '../services/AnalyticsBridge';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // Initialize notifications
    notificationManager.initialize().then(() => {
      notificationManager.requestPermissions();
    });

    // Track page view
    analyticsBridge.trackPageView('mobile_home');
  }, []);

  const navigateToWebView = (path: string = '') => {
    analyticsBridge.trackUserAction('navigate_to_webview', { path });
    navigation.navigate('WebView' as never, { path } as never);
  };

  const quickActions = [
    { title: 'Golf Simulator', path: '/simulator', icon: 'golf-outline' },
    { title: 'Tournaments', path: '/journey', icon: 'trophy-outline' },
    { title: 'Shop', path: '/shop', icon: 'storefront-outline' },
    { title: 'Fan Club', path: '/fan-club', icon: 'people-outline' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/400x200/000000/FFD700?text=Uncle+Joe\'s+Golf' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Uncle Joe's Golf</Text>
          <Text style={styles.heroSubtitle}>Professional Golf Journey</Text>
          <TouchableOpacity 
            style={styles.heroButton}
            onPress={() => navigateToWebView()}
          >
            <Text style={styles.heroButtonText}>Open Full Platform</Text>
            <Ionicons name="arrow-forward" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => navigateToWebView(action.path)}
            >
              <Ionicons 
                name={action.icon as keyof typeof Ionicons.glyphMap} 
                size={32} 
                color="#FFD700" 
              />
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Latest Updates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Updates</Text>
        <View style={styles.updateCard}>
          <View style={styles.updateHeader}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.updateTitle}>Tournament Update</Text>
          </View>
          <Text style={styles.updateText}>
            New tournament schedule for 2025 is now available. Check out the upcoming events!
          </Text>
          <TouchableOpacity 
            style={styles.updateButton}
            onPress={() => navigateToWebView('/journey')}
          >
            <Text style={styles.updateButtonText}>View Tournaments</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Native Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mobile Features</Text>
        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('Camera' as never)}
        >
          <Ionicons name="camera" size={32} color="#FFD700" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Swing Analysis</Text>
            <Text style={styles.featureText}>
              Use your camera to analyze your golf swing with AI-powered insights
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  hero: {
    position: 'relative',
    height: 200,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  heroButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 2,
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  actionTitle: {
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  updateCard: {
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  updateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  updateText: {
    color: '#CCC',
    lineHeight: 22,
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  updateButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    gap: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  featureText: {
    color: '#CCC',
    lineHeight: 20,
  },
});