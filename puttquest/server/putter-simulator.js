#!/usr/bin/env node

/**
 * PuttQuest Putter Simulator
 * Simulates BLE putter data for testing the mobile app
 */

import WebSocket, { WebSocketServer } from 'ws';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎯 PuttQuest Putter Simulator');
console.log('============================');
console.log('');
console.log('Commands:');
console.log('  swing <power> <angle>  - Simulate a swing (power 0-100, angle -180 to 180)');
console.log('  data <power> <angle>   - Send real-time data');
console.log('  connect                - Simulate connection');
console.log('  disconnect             - Simulate disconnection');
console.log('  help                   - Show this help');
console.log('  exit                   - Exit simulator');
console.log('');

let connected = false;
let wss;

function startWebSocketServer() {
  wss = new WebSocketServer({ port: 8080 });
  console.log('📡 WebSocket server started on port 8080');

  wss.on('connection', (ws) => {
    console.log('📱 Mobile app connected');
    connected = true;

    ws.on('message', (message) => {
      console.log('📨 Received:', message.toString());
    });

    ws.on('close', () => {
      console.log('📱 Mobile app disconnected');
      connected = false;
    });
  });
}

function sendToMobile(data) {
  if (!connected || !wss) {
    console.log('❌ No mobile app connected');
    return;
  }

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
      console.log('📤 Sent to mobile:', data);
    }
  });
}

function simulateSwing(power, angle) {
  if (!connected) {
    console.log('❌ No mobile app connected. Start the mobile app first.');
    return;
  }

  // Validate inputs
  power = Math.max(0, Math.min(100, parseFloat(power) || 0));
  angle = Math.max(-180, Math.min(180, parseFloat(angle) || 0));

  console.log(`🏌️ Simulating swing - Power: ${power}%, Angle: ${angle}°`);

  // Send real-time data updates
  const updates = 10;
  for (let i = 0; i < updates; i++) {
    setTimeout(() => {
      const currentPower = (power * (i + 1)) / updates;
      const currentAngle = angle + (Math.random() - 0.5) * 10; // Add some variation

      sendToMobile({
        type: 'putter_data',
        power: Math.round(currentPower),
        angle: Math.round(currentAngle)
      });
    }, i * 100);
  }

  // Send swing complete after animation
  setTimeout(() => {
    sendToMobile({
      power: power,
      angle: angle,
      swingComplete: true
    });
    console.log('✅ Swing complete!');
  }, updates * 100 + 200);
}

function sendRealTimeData(power, angle) {
  if (!connected) {
    console.log('❌ No mobile app connected');
    return;
  }

  power = Math.max(0, Math.min(100, parseFloat(power) || 0));
  angle = Math.max(-180, Math.min(180, parseFloat(angle) || 0));

  // Send data in format expected by mobile app
  sendToMobile({
    power: power,
    angle: angle
  });
}

function processCommand(input) {
  const parts = input.trim().split(/\s+/);
  const command = parts[0].toLowerCase();

  switch (command) {
    case 'swing':
      if (parts.length < 3) {
        console.log('❌ Usage: swing <power> <angle>');
        return;
      }
      simulateSwing(parts[1], parts[2]);
      break;

    case 'data':
      if (parts.length < 3) {
        console.log('❌ Usage: data <power> <angle>');
        return;
      }
      sendRealTimeData(parts[1], parts[2]);
      break;

    case 'connect':
      console.log('🔗 Simulating putter connection...');
      sendToMobile({ type: 'putter_connected' });
      break;

    case 'disconnect':
      console.log('🔌 Simulating putter disconnection...');
      sendToMobile({ type: 'putter_disconnected' });
      break;

    case 'help':
      console.log('');
      console.log('Commands:');
      console.log('  swing <power> <angle>  - Simulate a swing (power 0-100, angle -180 to 180)');
      console.log('  data <power> <angle>   - Send real-time data');
      console.log('  connect                - Simulate connection');
      console.log('  disconnect             - Simulate disconnection');
      console.log('  help                   - Show this help');
      console.log('  exit                   - Exit simulator');
      console.log('');
      break;

    case 'exit':
      console.log('👋 Goodbye!');
      process.exit(0);
      break;

    default:
      console.log('❌ Unknown command. Type "help" for available commands.');
  }
}

// Start the WebSocket server
startWebSocketServer();

// Command loop
function prompt() {
  rl.question('putter-sim> ', (input) => {
    processCommand(input);
    prompt();
  });
}

console.log('🚀 Ready! Start the mobile app and connect to test putter functionality.');
console.log('');
prompt();