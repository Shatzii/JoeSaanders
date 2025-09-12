'use client';
import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

interface GolfGameSceneProps {
  onShotTaken?: (shotData: any) => void;
}

class GolfGame extends Phaser.Scene {
  private ball!: Phaser.Physics.Arcade.Sprite;
  private club!: Phaser.GameObjects.Sprite;
  private powerBar!: Phaser.GameObjects.Graphics;
  private power = 0;
  private powerIncreasing = true;
  private isAiming = false;
  private aimLine!: Phaser.GameObjects.Graphics;
  private shotData: any = {};
  private onShotTaken?: (shotData: any) => void;
  private disabled = false;
  private shotHistory: any[] = [];
  private replayMode = false;
  private replayIndex = 0;
  private replayBall!: Phaser.Physics.Arcade.Sprite;
  private replayGraphics!: Phaser.GameObjects.Graphics;

  constructor(onShotTaken?: (shotData: any) => void, disabled = false) {
    super({ key: 'GolfGame' });
    this.onShotTaken = onShotTaken;
    this.disabled = disabled;
  }

  preload() {
    // Create simple shapes for golf elements
    this.load.image('ball', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('club', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create() {
    // Create course background
    const graphics = this.add.graphics();
    graphics.fillStyle(0x228B22);
    graphics.fillRect(0, 0, 800, 600);

    // Add hole
    graphics.fillStyle(0x000000);
    graphics.fillCircle(700, 300, 15);

    // Add tee box
    graphics.fillStyle(0x8B4513);
    graphics.fillRect(50, 290, 20, 20);

    // Create ball
    this.ball = this.physics.add.sprite(60, 300, 'ball');
    this.ball.setCircle(5);
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(0.3);
    this.ball.setDisplaySize(10, 10);

    // Create club (invisible for now)
    this.club = this.add.sprite(60, 300, 'club');
    this.club.setVisible(false);

    // Create power bar
    this.powerBar = this.add.graphics();
    this.powerBar.setPosition(50, 50);

    // Create aim line
    this.aimLine = this.add.graphics();

    // Create replay elements
    this.replayGraphics = this.add.graphics();
    this.replayBall = this.physics.add.sprite(60, 300, 'ball');
    this.replayBall.setCircle(5);
    this.replayBall.setDisplaySize(8, 8);
    this.replayBall.setTint(0xffd700); // Gold color for replay
    this.replayBall.setVisible(false);

    // Input handling - only if not disabled
    if (!this.disabled) {
      this.input.on('pointerdown', this.startAim, this);
      this.input.on('pointerup', this.takeShot, this);
    }

    // Add instructions
    const instructions = this.add.text(400, 50,
      this.disabled
        ? 'Upgrade to Pro for unlimited shots!'
        : 'Click and hold to aim, release to shoot!',
      {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
      }
    );
    instructions.setOrigin(0.5);
  }

  startAim(pointer: Phaser.Input.Pointer) {
    if (!this.isAiming) {
      this.isAiming = true;
      this.power = 0;
      this.powerIncreasing = true;
    }
  }

  takeShot(pointer: Phaser.Input.Pointer) {
    if (this.isAiming) {
      this.isAiming = false;

      // Calculate shot direction and power
      const angle = Phaser.Math.Angle.Between(this.ball.x, this.ball.y, pointer.x, pointer.y);
      const force = (this.power / 100) * 500; // Max force of 500

      // Apply physics
      this.physics.velocityFromRotation(angle, force, this.ball.body!.velocity);

      // Determine shot outcome
      const distance = Math.floor(force / 10);
      let outcome = 'Straight';

      if (Math.abs(angle) < 0.1) outcome = 'Straight';
      else if (angle < 0) outcome = 'Draw';
      else outcome = 'Fade';

      // Randomize outcome slightly for realism
      const random = Math.random();
      if (random < 0.1) outcome = 'Hook';
      else if (random < 0.2) outcome = 'Slice';

      this.shotData = {
        club: 'Driver',
        outcome,
        distance,
        club_used: 'Driver',
        hole_number: 1,
        shot_number: this.shotHistory.length + 1,
        timestamp: Date.now(),
        startPosition: { x: this.ball.x, y: this.ball.y },
        endPosition: { x: this.ball.x + Math.cos(angle) * distance, y: this.ball.y + Math.sin(angle) * distance },
        angle,
        force
      };

      // Store shot in history
      this.shotHistory.push({ ...this.shotData });

      // Dispatch custom event for the parent component
      if (this.onShotTaken) {
        this.onShotTaken(this.shotData);
      }

      // Also dispatch to window for other components
      window.dispatchEvent(new CustomEvent('shotTaken', { detail: this.shotData }));
    }
  }

  startReplay(shotIndex: number) {
    if (shotIndex >= 0 && shotIndex < this.shotHistory.length) {
      this.replayMode = true;
      this.replayIndex = shotIndex;
      const shot = this.shotHistory[shotIndex];
      
      // Reset ball position
      this.ball.setPosition(60, 300);
      this.ball.setVelocity(0, 0);
      
      // Show replay ball
      this.replayBall.setVisible(true);
      this.replayBall.setPosition(shot.startPosition.x, shot.startPosition.y);
      
      // Draw shot trajectory
      this.replayGraphics.clear();
      this.replayGraphics.lineStyle(3, 0xffd700, 0.8);
      this.replayGraphics.beginPath();
      this.replayGraphics.moveTo(shot.startPosition.x, shot.startPosition.y);
      this.replayGraphics.lineTo(shot.endPosition.x, shot.endPosition.y);
      this.replayGraphics.strokePath();
      
      // Animate replay ball
      this.tweens.add({
        targets: this.replayBall,
        x: shot.endPosition.x,
        y: shot.endPosition.y,
        duration: 2000,
        ease: 'Linear',
        onComplete: () => {
          this.replayMode = false;
          this.replayBall.setVisible(false);
          this.replayGraphics.clear();
        }
      });
    }
  }

  getShotHistory() {
    return this.shotHistory;
  }

  clearShotHistory() {
    this.shotHistory = [];
    this.replayGraphics.clear();
    this.replayBall.setVisible(false);
  }

  update() {
    if (this.isAiming) {
      // Update power bar
      this.powerBar.clear();

      if (this.powerIncreasing) {
        this.power += 2;
        if (this.power >= 100) {
          this.powerIncreasing = false;
        }
      } else {
        this.power -= 2;
        if (this.power <= 0) {
          this.powerIncreasing = true;
        }
      }

      // Draw power bar
      this.powerBar.fillStyle(0xff0000);
      this.powerBar.fillRect(0, 0, this.power * 2, 20);
      this.powerBar.lineStyle(2, 0xffffff);
      this.powerBar.strokeRect(0, 0, 200, 20);

      // Draw aim line
      this.aimLine.clear();
      const pointer = this.input.activePointer;
      const angle = Phaser.Math.Angle.Between(this.ball.x, this.ball.y, pointer.x, pointer.y);

      this.aimLine.lineStyle(2, 0xffff00);
      this.aimLine.beginPath();
      this.aimLine.moveTo(this.ball.x, this.ball.y);
      this.aimLine.lineTo(
        this.ball.x + Math.cos(angle) * 100,
        this.ball.y + Math.sin(angle) * 100
      );
      this.aimLine.strokePath();
    } else {
      this.powerBar.clear();
      this.aimLine.clear();
    }

    // Check if ball stopped moving
    if (this.ball.body && this.ball.body.velocity.x < 1 && this.ball.body.velocity.y < 1 &&
        this.ball.body.velocity.x > -1 && this.ball.body.velocity.y > -1) {
      this.ball.setVelocity(0, 0);
    }
  }
}

interface GolfSimulatorProps {
  onShotTaken?: (shotData: any) => void;
  disabled?: boolean;
}

export default function GolfSimulator({ onShotTaken, disabled = false }: GolfSimulatorProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: new GolfGame(onShotTaken, disabled)
    };

    gameInstanceRef.current = new Phaser.Game(config);

    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, [onShotTaken, disabled]);

  return (
    <div className="flex flex-col items-center">
      <div
        ref={gameRef}
        className="border-2 border-[#d4af37] rounded-lg shadow-lg"
        style={{ width: '800px', height: '600px' }}
      />
      <div className="mt-4 text-center text-sm text-gray-600 max-w-md">
        <p>🎯 <strong>How to Play:</strong></p>
        <p>1. Click and hold to build power</p>
        <p>2. Move mouse to aim your shot</p>
        <p>3. Release to take your shot</p>
        <p>4. Get AI coaching on your swing!</p>
      </div>
    </div>
  );
}