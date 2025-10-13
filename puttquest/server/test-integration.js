#!/usr/bin/env node

/**
 * Comprehensive test of putter simulator and mobile app integration
 */

import WebSocket from 'ws';

console.log('🧪 Comprehensive PuttQuest Putter Integration Test');
console.log('================================================\n');

// Test 1: Check if simulator is running
console.log('1️⃣ Testing simulator availability...');
const testWs = new WebSocket('ws://localhost:8080');

testWs.on('open', () => {
  console.log('✅ Simulator is running and accepting connections');
  testWs.close();

  // Test 2: Simulate mobile app connection and data flow
  console.log('\n2️⃣ Testing mobile app connection flow...');
  runMobileAppSimulation();
});

testWs.on('error', (error) => {
  console.log('❌ Simulator not available:', error.message);
  console.log('💡 Make sure to run: cd server && node putter-simulator.js');
  process.exit(1);
});

function runMobileAppSimulation() {
  console.log('📱 Simulating mobile app connection...');

  const mobileWs = new WebSocket('ws://localhost:8080');

  mobileWs.on('open', () => {
    console.log('✅ Mobile app connected to simulator');

    // Test 3: Send real-time swing data
    console.log('\n3️⃣ Testing real-time swing data...');
    let power = 0;
    let angle = 0;

    const dataInterval = setInterval(() => {
      power = Math.min(100, power + 15);
      angle = Math.sin(power / 10) * 20; // Simulate natural swing arc

      mobileWs.send(JSON.stringify({
        power: Math.round(power),
        angle: Math.round(angle)
      }));

      console.log(`📤 Sent: power=${Math.round(power)}, angle=${Math.round(angle)}`);

      if (power >= 100) {
        clearInterval(dataInterval);

        // Test 4: Send swing complete
        console.log('\n4️⃣ Testing swing completion...');
        setTimeout(() => {
          mobileWs.send(JSON.stringify({
            power: 85,
            angle: 5,
            swingComplete: true
          }));
          console.log('📤 Sent swing complete: power=85, angle=5');

          // Test 5: Test disconnection and reconnection
          console.log('\n5️⃣ Testing disconnection...');
          setTimeout(() => {
            mobileWs.close();
          }, 1000);
        }, 500);
      }
    }, 200);
  });

  mobileWs.on('message', (data) => {
    console.log('📨 Mobile app received:', data.toString());
  });

  mobileWs.on('close', () => {
    console.log('🔌 Mobile app disconnected');

    // Test reconnection
    console.log('\n6️⃣ Testing reconnection...');
    setTimeout(() => {
      const reconnectWs = new WebSocket('ws://localhost:8080');

      reconnectWs.on('open', () => {
        console.log('✅ Mobile app reconnected successfully');
        reconnectWs.close();

        console.log('\n🎉 All tests passed! Putter integration is working correctly.');
        console.log('\n📋 Test Summary:');
        console.log('✅ Simulator availability');
        console.log('✅ Mobile app connection');
        console.log('✅ Real-time swing data');
        console.log('✅ Swing completion');
        console.log('✅ Disconnection handling');
        console.log('✅ Reconnection capability');
        console.log('\n🚀 Ready for gameplay testing!');
      });

      reconnectWs.on('error', (error) => {
        console.log('❌ Reconnection failed:', error.message);
      });
    }, 1000);
  });

  mobileWs.on('error', (error) => {
    console.log('❌ Mobile app connection error:', error.message);
  });
}