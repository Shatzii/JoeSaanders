#!/usr/bin/env node

/**
 * Test mobile app data processing logic
 */

console.log('🧪 Testing Mobile App Data Processing Logic');
console.log('==========================================\n');

// Mock the required dependencies
const mockHaptics = {
  impactAsync: () => Promise.resolve(),
  notificationAsync: () => Promise.resolve()
};

const mockAudio = {
  Sound: class {
    replayAsync() { return Promise.resolve(); }
  }
};

// Mock React state
let mockAppState = {
  strokes: 0,
  power: 0,
  angle: 0,
  ballPosition: { x: 200, y: 350 },
  holePosition: { x: 300, y: 250 },
  isSwinging: false
};

let mockPlayerStats = {
  totalPutts: 0,
  longestPutt: 0
};

let mockSounds = {
  swingSound: new mockAudio.Sound(),
  successSound: new mockAudio.Sound()
};

// Test data processing functions
function handlePutterData(data) {
  console.log('📨 Processing putter data:', data);

  let power = 0;
  let angle = 0;
  let isSwingComplete = false;

  if (typeof data === 'string') {
    if (data.includes('SWING_COMPLETE')) {
      const parts = data.split(',');
      if (parts.length >= 3) {
        power = parseFloat(parts[1]) || 0;
        angle = parseFloat(parts[2]) || 0;
        isSwingComplete = true;
      }
    } else if (data.includes(',')) {
      const parts = data.split(',');
      power = parseFloat(parts[0]) || 0;
      angle = parseFloat(parts[1]) || 0;
    } else {
      power = parseFloat(data) || 0;
    }
  } else if (typeof data === 'object') {
    power = data.power || 0;
    angle = data.angle || 0;
    isSwingComplete = data.swingComplete || false;
  }

  // Validate and clamp values
  power = Math.max(0, Math.min(100, power));
  angle = Math.max(-180, Math.min(180, angle));

  if (isSwingComplete) {
    console.log(`✅ Swing complete: power=${power}, angle=${angle}`);
    handleSwingComplete(power, angle);
  } else {
    mockAppState.power = power;
    mockAppState.angle = angle;
    mockAppState.isSwinging = power > 10;
    console.log(`📊 Real-time data: power=${power}, angle=${angle}, swinging=${mockAppState.isSwinging}`);
  }
}

async function handleSwingComplete(power, angle) {
  console.log('🏌️ Executing swing complete logic...');

  mockAppState.isSwinging = false;
  mockAppState.strokes = mockAppState.strokes + 1;

  // Simulate haptic feedback
  await mockHaptics.impactAsync();

  // Simulate sound
  if (mockSounds.swingSound) await mockSounds.swingSound.replayAsync();

  const shotResult = calculateAdvancedShotResult(power, angle);
  executeShot(shotResult);
}

function calculateAdvancedShotResult(power, angle) {
  const width = 400; // Mock screen width
  const height = 600; // Mock screen height

  const maxDistance = width * 0.6;
  const baseDistance = (power / 100) * maxDistance;
  const windEffect = Math.random() * 20 - 10;
  const effectiveDistance = baseDistance + windEffect;

  const radians = (angle * Math.PI) / 180;
  const newX = mockAppState.ballPosition.x + Math.cos(radians) * effectiveDistance;
  const newY = mockAppState.ballPosition.y - Math.sin(radians) * effectiveDistance;

  const boundedX = Math.max(30, Math.min(width - 30, newX));
  const boundedY = Math.max(30, Math.min(height - 200, newY));

  const distanceToHole = Math.hypot(boundedX - mockAppState.holePosition.x, boundedY - mockAppState.holePosition.y);

  const result = {
    newPosition: { x: boundedX, y: boundedY },
    isInHole: distanceToHole < 25,
    distanceToHole
  };

  console.log(`🎯 Shot result: distance=${Math.round(distanceToHole)}, inHole=${result.isInHole}`);
  return result;
}

async function executeShot(shotResult) {
  console.log('🚀 Executing shot...');

  // Simulate ball movement animation
  mockAppState.ballPosition = shotResult.newPosition;

  // Update stats
  mockPlayerStats.totalPutts = mockPlayerStats.totalPutts + 1;
  mockPlayerStats.longestPutt = Math.max(mockPlayerStats.longestPutt, shotResult.distanceToHole);

  if (shotResult.isInHole) {
    console.log('🎉 HOLE IN ONE!');
    await handleHoleComplete();
  } else {
    console.log(`📍 Ball moved to: (${Math.round(shotResult.newPosition.x)}, ${Math.round(shotResult.newPosition.y)})`);
  }
}

async function handleHoleComplete() {
  console.log('🏆 Hole completed!');

  await mockHaptics.notificationAsync();
  if (mockSounds.successSound) await mockSounds.successSound.replayAsync();

  // Reset for next hole
  mockAppState.strokes = 0;
  mockAppState.power = 0;
  mockAppState.angle = 0;
  mockAppState.ballPosition = { x: 200, y: 350 };
  mockAppState.holePosition = {
    x: Math.random() * 340 + 30,
    y: Math.random() * 350 + 50
  };
  mockAppState.isSwinging = false;
}

// Test scenarios
async function runTests() {
  console.log('1️⃣ Testing real-time data processing...');
  handlePutterData({ power: 50, angle: 10 });
  handlePutterData({ power: 75, angle: -5 });
  handlePutterData({ power: 25, angle: 15 });

  console.log('\n2️⃣ Testing swing completion...');
  await handleSwingComplete(80, 5);

  console.log('\n3️⃣ Testing string data format...');
  handlePutterData("60,12");
  await handleSwingComplete(70, -8);

  console.log('\n4️⃣ Testing edge cases...');
  handlePutterData({ power: 150, angle: 200 }); // Should clamp values
  handlePutterData({ power: -10, angle: -200 }); // Should clamp values

  console.log('\n5️⃣ Testing hole-in-one scenario...');
  // Position ball very close to hole
  mockAppState.ballPosition = { x: 295, y: 255 };
  mockAppState.holePosition = { x: 300, y: 250 };
  await handleSwingComplete(5, 0); // Very gentle swing

  console.log('\n📊 Final State:');
  console.log('App State:', JSON.stringify(mockAppState, null, 2));
  console.log('Player Stats:', JSON.stringify(mockPlayerStats, null, 2));

  console.log('\n✅ Data processing tests completed successfully!');
}

runTests();