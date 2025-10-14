# Uncle Joe's Golf - Mobile App Deployment Guide

## Overview
This guide covers the complete process for building and deploying the Uncle Joe's Golf mobile app using Expo Application Services (EAS) Build and submitting to app stores.

## Prerequisites

### Required Accounts
1. **Expo Account**: Sign up at [expo.dev](https://expo.dev)
2. **Apple Developer Program**: $99/year at [developer.apple.com](https://developer.apple.com)
3. **Google Play Console**: $25 one-time fee at [play.google.com/console](https://play.google.com/console)

### Development Environment
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- EAS CLI: `npm install -g eas-cli`

## Project Structure
```
joe-sanders-golf/mobile/
├── App.tsx                 # Main app component
├── package.json           # Dependencies and scripts
├── src/                   # Source code
├── assets/                # App icons and images
└── app.json              # Expo configuration (to be created)
```

## Step 1: EAS Build Setup

### 1.1 Initialize EAS
```bash
cd joe-sanders-golf/mobile
eas build:configure
```

This will create `eas.json` in the mobile directory.

### 1.2 Configure EAS Build (eas.json)
```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "channel": "production"
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 1.3 Environment Variables
Create `.env` in the mobile directory:
```bash
# App Configuration
APP_NAME="Uncle Joe's Golf"
APP_VERSION="1.0.0"
BUNDLE_IDENTIFIER="com.unclejoesgolf.app"
PACKAGE_NAME="com.unclejoesgolf.app"

# API Keys (same as web app)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 2: App Store Configuration

### 2.1 iOS Configuration

#### App Store Connect Setup
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Create new app with:
   - Name: "Uncle Joe's Golf"
   - Bundle ID: `com.unclejoesgolf.app`
   - SKU: `uncle-joes-golf-001`

#### Required Assets
- **App Icon**: 1024x1024px PNG
- **Screenshots**: Various sizes (iPhone/iPad)
- **App Store Description**: 4000 characters max
- **Keywords**: golf, simulator, training, professional
- **Support URL**: https://stonesgolf.com
- **Privacy Policy**: https://stonesgolf.com/privacy-policy

### 2.2 Android Configuration

#### Google Play Console Setup
1. Go to [play.google.com/console](https://play.google.com/console)
2. Create new app
3. Fill in store listing:
   - Title: "Uncle Joe's Golf"
   - Package name: `com.unclejoesgolf.app`

#### Required Assets
- **App Icon**: 512x512px PNG
- **Feature Graphic**: 1024x500px PNG
- **Screenshots**: Various sizes
- **Description**: 4000 characters max

## Step 3: Build Configuration

### 3.1 Update app.json
```json
{
  "expo": {
    "name": "Uncle Joe's Golf",
    "slug": "uncle-joes-golf",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.unclejoesgolf.app",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      },
      "package": "com.unclejoesgolf.app",
      "versionCode": 1
    },
    "plugins": [
      "expo-camera",
      "expo-location",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#FFD700"
        }
      ]
    ]
  }
}
```

### 3.2 Create Required Assets
```bash
cd joe-sanders-golf/mobile

# Create assets directory
mkdir -p assets

# Required icon sizes (create these from your main logo)
# - icon.png (1024x1024) - App icon
# - adaptive-icon.png (1024x1024) - Android adaptive icon
# - splash.png (1242x2436) - Splash screen
# - notification-icon.png (96x96) - Push notification icon
```

## Step 4: Building the App

### 4.1 Development Build
```bash
cd joe-sanders-golf/mobile

# Login to EAS
eas login

# Build development version
eas build --platform ios --profile development
eas build --platform android --profile development
```

### 4.2 Production Build
```bash
# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Build for both platforms
eas build --platform all --profile production
```

### 4.3 Monitor Build Progress
```bash
# Check build status
eas build:list

# View build logs
eas build:view <build-id>
```

## Step 5: App Store Submission

### 5.1 iOS Submission
```bash
# Submit to TestFlight (internal testing)
eas submit --platform ios --profile production

# For App Store release, use App Store Connect:
# 1. Download IPA from EAS build
# 2. Upload to App Store Connect
# 3. Fill in metadata
# 4. Submit for review
```

### 5.2 Android Submission
```bash
# Submit to Google Play (internal testing)
eas submit --platform android --profile production

# For production release:
# 1. Create release in Google Play Console
# 2. Upload AAB from EAS build
# 3. Fill in store listing
# 4. Publish
```

## Step 6: Testing

### 6.1 Internal Testing
- **iOS**: Use TestFlight for beta testing
- **Android**: Use Google Play Internal Testing Track

### 6.2 Pre-Launch Checklist
- [ ] App builds successfully on both platforms
- [ ] All required assets uploaded
- [ ] Store listings completed
- [ ] Privacy policy and terms of service linked
- [ ] Payment processing configured (if applicable)
- [ ] Analytics and crash reporting set up
- [ ] App permissions documented

## Step 7: Production Deployment

### 7.1 Update Process
```bash
# Increment version numbers
# Update app.json version and build numbers
# Update store listings if needed
# Rebuild and resubmit
```

### 7.2 Monitoring
- Monitor crash reports
- Track user feedback
- Monitor app store ratings
- Update based on user feedback

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear build cache
eas build:delete <build-id>

# Check build logs
eas build:view <build-id>

# Rebuild with verbose logging
EXPO_DEBUG=true eas build --platform ios
```

#### Submission Issues
- Ensure all required screenshots are uploaded
- Check that bundle/package names match
- Verify app store listings are complete
- Confirm privacy policy URLs are accessible

#### Permission Issues
- Camera permissions for swing analysis
- Location permissions for course finding
- Notification permissions for updates

## Cost Estimation

### Development Costs
- Apple Developer Program: $99/year
- Google Play Console: $25 one-time
- EAS Build: Free for basic builds

### App Store Fees
- Apple App Store: 30% of revenue
- Google Play Store: 30% of revenue (after $1M annual revenue)

## Security Considerations

- Store API keys securely using EAS secrets
- Implement proper authentication
- Use HTTPS for all API calls
- Regular security audits
- Keep dependencies updated

## Support and Maintenance

- Monitor app store reviews
- Respond to user feedback
- Regular app updates
- Bug fixes and feature enhancements
- Performance monitoring

---

## Quick Start Commands

```bash
# Setup
cd joe-sanders-golf/mobile
eas login
eas build:configure

# Development
npm run android  # Start Android emulator
npm run ios      # Start iOS simulator

# Building
npm run build:android  # Build Android APK
npm run build:ios      # Build iOS IPA

# Submission
npm run submit:android  # Submit to Google Play
npm run submit:ios      # Submit to TestFlight
```

This guide provides a complete roadmap for deploying the Uncle Joe's Golf mobile app. Follow each step carefully to ensure successful deployment to both iOS and Android app stores.