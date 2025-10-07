# PuttQuest

Physical putting meets mobile gaming. This folder contains a minimal, working server and mobile app scaffold to start iterating.

## Structure

- server/ — Express + Socket.io + MongoDB + Redis backend
- mobile/ — Expo React Native app with BLE, animations, and Socket.io client

## Prerequisites

- Node 18+ (recommended 20)
- MongoDB running locally (mongodb://localhost:27017)
- Redis running locally (redis://localhost:6379)
- iOS/Android setup for Expo (or use Expo Go)

## Setup — Server

1. Copy env file

```
cp server/.env.example server/.env
```

2. Install deps and start

```
cd server
npm i
npm run dev
```

The server listens on PORT (default 3000).

## Setup — Mobile

1. Install deps

```
cd mobile
npm i
```

2. Start the Expo app

```
npm start
```

3. Open on device/emulator. The app will try to connect to ws server at http://localhost:3000.

Note: Provide assets under `mobile/assets` (icon.png, splash.png, etc.) for full branding. A placeholder animation is included.

## Notes

- BLE service/characteristic UUIDs are placeholders; update for your hardware.
- Physics and gameplay are simplified for demo; tune as needed.
- Authentication endpoints exist; integrate tokens on the client for secured routes.
- This is a starter implementation. Expand tests, add CI, and productionize configs as you scale.
