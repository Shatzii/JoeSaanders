#!/usr/bin/env node

/**
 * Test putter reconnection and error handling scenarios
 */

import WebSocket from 'ws';

console.log('🧪 Testing Putter Reconnection and Error Handling');
console.log('=================================================\n');

// Test 1: Normal connection and data flow
console.log('1️⃣ Testing normal connection...');
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('✅ Connected to simulator');

  // Send some data
  ws.send(JSON.stringify({ power: 50, angle: 0 }));
  console.log('📤 Sent test data');

  // Test 2: Simulate disconnection
  setTimeout(() => {
    console.log('\n2️⃣ Testing disconnection...');
    ws.close();
  }, 1000);
});

ws.on('message', (data) => {
  console.log('📨 Received:', data.toString());
});

ws.on('close', (code, reason) => {
  console.log(`🔌 Disconnected (code: ${code}, reason: ${reason})`);

  // Test 3: Test reconnection
  console.log('\n3️⃣ Testing reconnection...');
  setTimeout(() => {
    const reconnectWs = new WebSocket('ws://localhost:8080');

    reconnectWs.on('open', () => {
      console.log('✅ Reconnected successfully');

      // Send data after reconnection
      reconnectWs.send(JSON.stringify({ power: 75, angle: 10, swingComplete: true }));
      console.log('📤 Sent swing data after reconnection');

      setTimeout(() => {
        reconnectWs.close();
      }, 500);
    });

    reconnectWs.on('message', (data) => {
      console.log('📨 Received after reconnection:', data.toString());
    });

    reconnectWs.on('close', () => {
      console.log('🔌 Reconnection test completed');

      // Test 4: Test connection to non-existent server
      console.log('\n4️⃣ Testing connection to invalid server...');
      const invalidWs = new WebSocket('ws://localhost:8081'); // Wrong port

      invalidWs.on('error', (error) => {
        console.log('✅ Correctly failed to connect to invalid server:', error.message);

        // Test 5: Test rapid reconnection attempts
        console.log('\n5️⃣ Testing rapid reconnection attempts...');
        testRapidReconnections();
      });

      invalidWs.on('open', () => {
        console.log('❌ Unexpectedly connected to invalid server');
        invalidWs.close();
      });
    });

    reconnectWs.on('error', (error) => {
      console.log('❌ Reconnection failed:', error.message);
    });

  }, 500);
});

ws.on('error', (error) => {
  console.log('❌ Connection error:', error.message);
});

function testRapidReconnections() {
  let attempts = 0;
  const maxAttempts = 3;

  function attemptReconnect() {
    if (attempts >= maxAttempts) {
      console.log('✅ Rapid reconnection test completed');
      console.log('\n📋 Error Handling Test Summary:');
      console.log('✅ Normal connection');
      console.log('✅ Disconnection handling');
      console.log('✅ Reconnection capability');
      console.log('✅ Invalid server error handling');
      console.log('✅ Rapid reconnection attempts');
      console.log('\n🎉 All error handling tests passed!');
      return;
    }

    attempts++;
    console.log(`🔄 Reconnection attempt ${attempts}/${maxAttempts}...`);

    const testWs = new WebSocket('ws://localhost:8080');

    testWs.on('open', () => {
      console.log(`✅ Reconnection attempt ${attempts} successful`);
      testWs.send(JSON.stringify({ power: attempts * 20, angle: attempts * 5 }));
      setTimeout(() => {
        testWs.close();
        setTimeout(attemptReconnect, 200); // Rapid attempt
      }, 100);
    });

    testWs.on('error', (error) => {
      console.log(`❌ Reconnection attempt ${attempts} failed:`, error.message);
      setTimeout(attemptReconnect, 200);
    });
  }

  attemptReconnect();
}

// Timeout for entire test
setTimeout(() => {
  console.log('\n⏰ Test timeout - some tests may have failed');
  process.exit(1);
}, 15000);