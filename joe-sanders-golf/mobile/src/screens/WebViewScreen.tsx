import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, RouteProp } from '@react-navigation/native';
import { analyticsBridge } from '../services/AnalyticsBridge';

type WebViewScreenRouteProp = RouteProp<{ params: { path?: string } }, 'params'>;

export default function WebViewScreen() {
  const route = useRoute<WebViewScreenRouteProp>();
  const webViewRef = useRef<WebView>(null);
  const path = route.params?.path || '';
  
  // Base URL for the web platform
  const baseUrl = __DEV__ 
    ? 'http://localhost:3000' 
    : 'https://unclejoesgolf.com';
  
  const fullUrl = `${baseUrl}${path}`;

  useEffect(() => {
    // Set WebView ref for analytics bridge
    analyticsBridge.setWebViewRef(webViewRef);

    // Track WebView navigation in analytics
    analyticsBridge.trackEvent('webview_opened', {
      path,
      url: fullUrl,
      timestamp: new Date().toISOString(),
    });
  }, [path, fullUrl]);

  const handleMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      
      switch (message.type) {
        case 'analytics_event':
          analyticsBridge.trackEvent(message.event_name, message.properties);
          break;
          
        case 'navigation':
          if (message.path) {
            webViewRef.current?.injectJavaScript(`
              window.location.href = '${message.path}';
            `);
          }
          break;
          
        case 'share_data':
          // Note: handleSharedData not implemented yet
          console.log('Shared data:', message.payload);
          break;
          
        default:
          console.log('Unknown message type from WebView:', message.type);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    // Track page navigation
    analyticsBridge.trackEvent('webview_navigation', {
      url: navState.url,
      canGoBack: navState.canGoBack,
      canGoForward: navState.canGoForward,
    });
  };

  const handleError = (error: any) => {
    console.error('WebView error:', error);
    Alert.alert(
      'Connection Error',
      'Unable to load the golf platform. Please check your internet connection.',
      [{ text: 'OK' }]
    );
  };

  const injectedJavaScript = `
    // Set up mobile app detection
    window.isMobileApp = true;
    window.mobileAppPlatform = 'react-native';
    
    // Set up message handler for communication with React Native
    window.ReactNativeWebView = {
      postMessage: function(message) {
        window.ReactNativeWebView.postMessage(message);
      }
    };
    
    // Notify web app that mobile app is ready
    setTimeout(() => {
      if (window.handleMobileAppMessage) {
        window.handleMobileAppMessage(JSON.stringify({
          type: 'mobile_app_ready',
          platform: 'react-native',
          timestamp: new Date().toISOString()
        }));
      }
    }, 1000);
    
    // Override console.log to send logs to React Native (for debugging)
    if (${__DEV__ ? 'true' : 'false'}) {
      const originalLog = console.log;
      console.log = function(...args) {
        originalLog.apply(console, args);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'console_log',
          message: args.join(' ')
        }));
      };
    }
    
    true; // Required for injected JavaScript
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: fullUrl }}
        style={styles.webview}
        onMessage={handleMessage}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleError}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#FFD700" />
          </View>
        )}
        allowsBackForwardNavigationGestures={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scalesPageToFit={true}
        mixedContentMode="compatibility"
        originWhitelist={['*']}
        userAgent="UncleJoesGolfMobileApp/1.0"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});