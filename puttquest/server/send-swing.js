#!/usr/bin/env node

/**
 * Send swing command to putter simulator
 */

import WebSocket from 'ws';

console.log('🏌️ Sending swing command to simulator...');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('✅ Connected to simulator');

  // Send swing command (this simulates what the simulator's command interface would do)
  // But actually, the simulator expects commands from stdin, not WebSocket messages
  // So this won't work. Let me try a different approach.

  console.log('❌ This approach won\'t work. The simulator expects stdin commands.');
  ws.close();
});

ws.on('close', () => {
  console.log('🔌 Connection closed');
});

ws.on('error', (error) => {
  console.error('❌ Error:', error.message);
});