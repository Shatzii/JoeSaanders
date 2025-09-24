export const config = {
  webUrl: __DEV__
    ? process.env.EXPO_PUBLIC_WEB_URL || 'http://localhost:3000'
    : 'https://unclejoesgolf.com',
};