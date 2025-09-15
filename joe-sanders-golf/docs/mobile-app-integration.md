# Mobile App Integration Guide

## Overview

The Uncle Joes Golf platform includes a **Mobile App Bridge** for future integration with native mobile applications. This bridge provides seamless communication between the web platform and mobile apps using shared analytics, data synchronization, and cross-platform features.

## Current Implementation

### 🔧 **MobileAppBridge Component**
- **File**: `src/components/MobileAppBridge.tsx`
- **Status**: ✅ **Integrated** into root layout
- **Purpose**: Detect mobile app context and establish communication bridge

### 🔗 **Integration Points**

#### **Web Platform Integration**
```tsx
// Already integrated in src/app/layout.tsx
<MobileAppBridge enabled={true} />
```

#### **Analytics Sharing**
- Mobile app detection and platform identification
- Shared analytics events between web and mobile
- Consistent user tracking across platforms

#### **Communication Channels**
- **React Native WebView**: Two-way messaging support
- **iOS WKWebView**: Native iOS app integration
- **Android WebView**: Android app communication

## Mobile App Development (Future)

### 📱 **Planned Mobile App Features**

1. **React Native Application**
   - Cross-platform iOS and Android app
   - Embedded WebView for web content
   - Native performance optimization

2. **Shared Analytics Bridge**
   - Unified analytics tracking
   - Cross-platform user journey mapping
   - Consistent performance metrics

3. **Native Features**
   - Push notifications for tournament updates
   - Offline content caching
   - Native camera integration for swing analysis
   - GPS location for course integration

### 🛠 **Implementation Roadmap**

#### **Phase 1: WebView Integration** ✅
- [x] Mobile app detection
- [x] Communication bridge setup
- [x] Analytics sharing infrastructure

#### **Phase 2: React Native App** 📋
- [ ] React Native project setup
- [ ] WebView component integration
- [ ] Native navigation and tab structure
- [ ] Push notification setup

#### **Phase 3: Native Features** 📋
- [ ] Camera integration for swing analysis
- [ ] GPS and course location features
- [ ] Offline content synchronization
- [ ] Native performance optimizations

#### **Phase 4: Advanced Features** 📋
- [ ] Augmented reality swing overlay
- [ ] Apple Watch / Wear OS integration
- [ ] Social sharing and tournament live updates
- [ ] Advanced biometric tracking

## API Communication

### **Web to Mobile App**
```typescript
import { sendToMobileApp } from '@/components/MobileAppBridge';

// Send data to mobile app
sendToMobileApp({
  type: 'navigation',
  path: '/tournament/stones-2025'
});

// Send analytics event
sendToMobileApp({
  type: 'analytics_event',
  event_name: 'tournament_view',
  properties: { tournament_id: 'stones-2025' }
});
```

### **Mobile App to Web**
```typescript
// Mobile app sends message to web
const message = {
  type: 'share_data',
  payload: {
    type: 'swing_analysis',
    data: { /* swing data */ }
  }
};

// React Native
window.ReactNativeWebView.postMessage(JSON.stringify(message));

// iOS
window.webkit.messageHandlers.iosApp.postMessage(message);

// Android
window.Android.receiveMessage(JSON.stringify(message));
```

## Usage Examples

### **Detect Mobile App Context**
```typescript
import { isMobileAppContext } from '@/components/MobileAppBridge';

if (isMobileAppContext()) {
  // Running inside mobile app
  // Hide web-specific navigation
  // Enable mobile-specific features
}
```

### **Listen for Mobile App Data**
```typescript
import { useMobileAppData } from '@/components/MobileAppBridge';

function MyComponent() {
  useMobileAppData(); // Sets up listeners
  
  useEffect(() => {
    const handleMobileData = (event) => {
      const sharedData = event.detail;
      // Process data shared from mobile app
    };
    
    window.addEventListener('mobileAppDataShared', handleMobileData);
    return () => window.removeEventListener('mobileAppDataShared', handleMobileData);
  }, []);
}
```

## Configuration

### **Environment Variables**
```bash
# Mobile app configuration (future)
MOBILE_APP_BUNDLE_ID=com.unclejoesgolf.app
MOBILE_APP_DEEP_LINK_SCHEME=unclejoesgolf
MOBILE_APP_STORE_URL=https://apps.apple.com/app/uncle-joes-golf
GOOGLE_PLAY_URL=https://play.google.com/store/apps/details?id=com.unclejoesgolf.app
```

### **Analytics Integration**
```typescript
// Mobile app analytics events automatically tracked:
// - mobile_app_detected: When mobile app loads web content
// - mobile_app_data_shared: When mobile app shares data with web
// - Custom events: Any events sent from mobile app
```

## Testing

### **Mobile App Context Simulation**
```typescript
// Simulate React Native WebView
(window as any).ReactNativeWebView = {
  postMessage: (message: string) => console.log('Mobile app message:', message)
};

// Simulate iOS WebView
(window as any).webkit = {
  messageHandlers: {
    iosApp: {
      postMessage: (message: any) => console.log('iOS message:', message)
    }
  }
};

// Simulate Android WebView
(window as any).Android = {
  receiveMessage: (message: string) => console.log('Android message:', message)
};
```

## Benefits

### **📊 Unified Analytics**
- Consistent tracking across web and mobile
- Complete user journey mapping
- Cross-platform performance insights

### **🔄 Seamless Experience**
- Shared data between platforms
- Consistent UI/UX patterns
- Cross-platform feature parity

### **🚀 Performance**
- Native mobile performance
- Web platform flexibility
- Optimized for each platform

## Future Enhancements

1. **Real-time Synchronization**: Live data sync between web and mobile
2. **Offline Support**: Mobile app works without internet connectivity
3. **Push Notifications**: Tournament updates and personalized alerts
4. **AR Features**: Augmented reality for swing analysis and course visualization
5. **Wearable Integration**: Apple Watch and Android Wear support

---

**Status**: Mobile App Bridge infrastructure complete and ready for native app development.

**Next Steps**: Begin React Native application development using this integration foundation.