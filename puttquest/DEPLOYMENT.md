# PuttQuest Deployment Guide

## Overview
PuttQuest consists of two main components that need to be deployed:

1. **Backend Server** (Node.js + Socket.io + MongoDB + Redis)
2. **Mobile App** (Expo React Native)

## Backend Server Deployment

### Option 1: Railway (Recommended)

Railway provides easy deployment with built-in MongoDB and Redis support.

#### Prerequisites
- Railway account: https://railway.app
- GitHub repository connected to Railway

#### Deployment Steps

1. **Connect Repository**
   ```bash
   # Push your code to GitHub first
   cd puttquest
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Railway Project**
   - Go to Railway dashboard
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your PuttQuest repository

3. **Configure Environment Variables**
   In Railway project settings, add:
   ```bash
   MONGODB_URI=${{MongoDB.MONGODB_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   JWT_SECRET=your-super-secret-jwt-key-here
   ALLOWED_ORIGINS=https://your-app-url.railway.app,exp://your-expo-app-url
   PORT=3000
   NODE_ENV=production
   ```

4. **Add MongoDB Database**
   - In Railway project, click "Add Plugin" → "MongoDB"
   - Railway will automatically set the `MONGODB_URI` variable

5. **Add Redis Database**
   - Click "Add Plugin" → "Redis"
   - Railway will automatically set the `REDIS_URL` variable

6. **Deploy**
   - Railway will automatically build and deploy
   - Your server will be available at `https://your-project-name.railway.app`

### Option 2: Heroku

#### Prerequisites
- Heroku account and CLI: https://heroku.com
- MongoDB Atlas account: https://mongodb.com/atlas
- Redis Cloud or similar

#### Deployment Steps

1. **Create Heroku App**
   ```bash
   cd puttquest/server
   heroku create puttquest-server
   ```

2. **Add MongoDB**
   - Create MongoDB Atlas cluster
   - Add connection string to Heroku config:
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-atlas-connection-string"
   ```

3. **Add Redis**
   - Use Redis Cloud or Heroku Redis add-on
   ```bash
   heroku addons:create rediscloud:30
   # Or use Heroku Redis
   heroku addons:create heroku-redis:hobby-dev
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET="your-jwt-secret"
   heroku config:set ALLOWED_ORIGINS="https://your-heroku-app.herokuapp.com"
   heroku config:set NODE_ENV="production"
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

## Mobile App Deployment

### Prerequisites
- Expo account: https://expo.dev
- EAS CLI: `npm install -g eas-cli`
- Apple Developer Program ($99/year)
- Google Play Console ($25 one-time)

### Step 1: EAS Setup

1. **Login to EAS**
   ```bash
   cd puttquest/mobile
   eas login
   ```

2. **Configure EAS**
   ```bash
   eas build:configure
   ```

3. **Create eas.json**
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

### Step 2: App Store Configuration

#### iOS Setup
1. **Create App ID** in Apple Developer Console
   - Bundle ID: `com.puttquest.app`
   - Enable required capabilities (if any)

2. **Create App** in App Store Connect
   - Name: "PuttQuest"
   - Bundle ID: `com.puttquest.app`

#### Android Setup
1. **Create App** in Google Play Console
   - Package name: `com.puttquest.app`
   - App name: "PuttQuest"

### Step 3: Update app.json

```json
{
  "expo": {
    "name": "PuttQuest",
    "slug": "puttquest",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0A1F35"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.puttquest.app",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0A1F35"
      },
      "package": "com.puttquest.app",
      "versionCode": 1
    },
    "extra": {
      "serverUrl": "https://your-server-url.railway.app"
    }
  }
}
```

### Step 4: Build and Submit

#### Development Build (Testing)
```bash
# iOS
eas build --platform ios --profile development

# Android
eas build --platform android --profile development
```

#### Production Build
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production

# Both platforms
eas build --platform all --profile production
```

#### Submit to App Stores
```bash
# iOS (TestFlight first, then App Store)
eas submit --platform ios --profile production

# Android (Internal testing first, then Production)
eas submit --platform android --profile production
```

## Environment Configuration

### Backend Environment Variables
```bash
# Production
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
JWT_SECRET=your-production-jwt-secret
ALLOWED_ORIGINS=https://your-mobile-app-url,https://your-web-app-url
PORT=3000
NODE_ENV=production
```

### Mobile App Environment Variables
```bash
# In app.json extra field
"extra": {
  "serverUrl": "https://your-production-server-url",
  "apiKey": "your-api-key-if-needed"
}
```

## Required Assets

### App Icons and Images
Place in `mobile/assets/`:
- `icon.png` (1024x1024) - Main app icon
- `adaptive-icon.png` (1024x1024) - Android adaptive icon
- `splash.png` (1242x2436) - Splash screen
- `notification-icon.png` (96x96) - Push notifications

### App Store Assets
- **Screenshots**: Various device sizes
- **App Description**: Compelling description for store listings
- **Privacy Policy**: Required for app stores

## Testing Deployment

### Pre-Launch Checklist
- [ ] Server deployed and accessible
- [ ] Database connections working
- [ ] Mobile app builds successfully
- [ ] BLE connectivity tested
- [ ] Socket.io communication working
- [ ] Authentication flow tested
- [ ] Error handling verified

### Post-Launch Monitoring
- Monitor server logs for errors
- Track app store ratings and reviews
- Monitor user engagement metrics
- Plan regular updates and bug fixes

## Cost Estimation

### Backend (Railway)
- Server: ~$5-10/month
- MongoDB: ~$0-10/month (depending on usage)
- Redis: ~$0-5/month
- Total: ~$5-25/month

### Mobile App Development
- Apple Developer: $99/year
- Google Play: $25 one-time
- EAS Build: Free for basic builds

### App Store Fees
- Apple: 30% of revenue
- Google: 30% of revenue (after $1M annual)

## Troubleshooting

### Common Issues

#### Server Connection Issues
- Verify ALLOWED_ORIGINS includes your app URLs
- Check CORS configuration
- Ensure server is running and accessible

#### Build Failures
- Check Expo configuration
- Verify all required assets exist
- Review build logs: `eas build:view <build-id>`

#### App Store Rejections
- Ensure privacy policy is linked
- Provide accurate app descriptions
- Test all app features thoroughly

## Quick Start Commands

```bash
# Backend Deployment (Railway)
cd puttquest
git add .
git commit -m "Deploy to production"
git push origin main
# Railway auto-deploys

# Mobile App Build
cd mobile
eas login
eas build --platform all --profile production
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

This guide provides a complete deployment strategy for PuttQuest. The Railway + EAS Build combination offers the easiest path to production with good performance and cost efficiency.