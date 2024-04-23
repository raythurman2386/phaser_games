import Explosion from "./explosion";
import { LightParticle } from "./particle";
import ShootingPatterns from "./shooting_patterns";

class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name = "player1", powerUp = "water") {
    super(scene, x, y, name);
    this.name = name;
    this.spawnShadow(x, y);
    this.powerUp = powerUp;
    this.id = Math.random();
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.body.setAllowGravity(false);
    this.body.setCircle(26);
    this.body.setOffset(6, 9);
    this.power = 0;
    this.blinking = false;
    this.shootingPatterns = new ShootingPatterns(this.scene, this.name);
    this.init();
    this.setControls();
    this.shootTimer = scene.time.addEvent({
      delay: 300,
      callback: () => this.shoot(),
      callbackScope: this,
      loop: true,
    });
  }

  spawnShadow(x, y) {
    this.shadow = this.scene.add
      .image(x + 20, y + 20, "player1")
      .setTint(0x000000)
      .setAlpha(0.4);
  }

  init() {
    this.scene.anims.create({
      key: this.name,
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 0,
        end: 0,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: this.name + "right",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 1,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: this.name + "left",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 2,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.play(this.name, true);

    this.upDelta = 0;
  }

  setControls() {
    this.SPACE = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.cursor = this.scene.input.keyboard.createCursorKeys();
    this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.scene.input.on("pointermove", (pointer) => {
      this.x = pointer.worldX;
      this.y = pointer.worldY;
    });
  }

  shoot() {
    this.scene.playAudio("shot");
    this.shootingPatterns.shoot(this.x, this.y, this.powerUp);
  }

  update(timestep, delta) {
    if (this.death) return;

    const playerVelocityX = this.body.velocity.x;
    const playerVelocityY = this.body.velocity.y;

    if (this.cursor.left.isDown) {
      this.x -= 5;
      this.anims.play(this.name + "left", true);
      this.shadow.setScale(0.5, 1);
    } else if (this.cursor.right.isDown) {
      this.x += 5;
      this.anims.play(this.name + "right", true);
      this.shadow.setScale(0.5, 1);
    } else {
      this.anims.play(this.name, true);
      this.shadow.setScale(1, 1);
    }

    if (this.playerVelocityX <= 0) {
      this.anims.play(this.name + "left", true);
      this.shadow.setScale(0.5, 1);
    } else if (this.playerVelocityY >= 0) {
      this.anims.play(this.name + "right", true);
      this.shadow.setScale(0.5, 1);
    }

    if (this.cursor.up.isDown) {
      this.y -= 5;
    } else if (this.cursor.down.isDown) {
      this.y += 5;
    }

    this.scene.trailLayer.add(
      new LightParticle(this.scene, this.x, this.y, 0xffffff, 10)
    );
    this.updateShadow();
  }

  updateShadow() {
    this.shadow.x = this.x + 20;
    this.shadow.y = this.y + 20;
  }

  showPoints(score, color = 0xff0000) {
    let text = this.scene.add
      .bitmapText(this.x + 20, this.y - 30, "starshipped", score, 20, 0xfffd37)
      .setOrigin(0.5);
    this.scene.tweens.add({
      targets: text,
      duration: 2000,
      alpha: { from: 1, to: 0 },
      y: { from: text.y - 10, to: text.y - 100 },
    });
  }

  dead() {
    this.shootTimer.remove();
    const explosion = this.scene.add
      .circle(this.x, this.y, 10)
      .setStrokeStyle(40, 0xffffff);
    this.scene.tweens.add({
      targets: explosion,
      radius: { from: 10, to: 512 },
      alpha: { from: 1, to: 0.3 },
      duration: 300,
      onComplete: () => {
        explosion.destroy();
      },
    });
    this.scene.cameras.main.shake(500);
    this.death = true;
    this.shadow.destroy();
    new Explosion(this.scene, this.x, this.y, 40);
    super.destroy();
  }
}

export default Player;
