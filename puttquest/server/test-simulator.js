#!/usr/bin/env node

/**
 * Test script for putter simulator connection
 */

import WebSocket from 'ws';

console.log('🧪 Testing putter simulator connection...');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('✅ Connected to putter simulator');

  // Send a test swing
  console.log('🏌️ Sending test swing...');
  setTimeout(() => {
    ws.send(JSON.stringify({
      power: 75,
      angle: 5,
      swingComplete: true
    }));
    console.log('📤 Sent swing data: power=75, angle=5');
  }, 1000);

  // Send real-time data
  console.log('📊 Sending real-time data...');
  let count = 0;
  const interval = setInterval(() => {
    if (count < 5) {
      ws.send(JSON.stringify({
        power: 50 + count * 10,
        angle: count * 2
      }));
      console.log(`📤 Sent data: power=${50 + count * 10}, angle=${count * 2}`);
      count++;
    } else {
      clearInterval(interval);
      console.log('✅ Test complete');
      ws.close();
    }
  }, 500);
});

ws.on('message', (data) => {
  console.log('📨 Received:', data.toString());
});

ws.on('close', () => {
  console.log('🔌 Connection closed');
  process.exit(0);
});

ws.on('error', (error) => {
  console.error('❌ Connection error:', error.message);
  process.exit(1);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏰ Test timeout');
  ws.close();
  process.exit(1);
}, 10000);