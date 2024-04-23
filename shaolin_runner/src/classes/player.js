export class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.setOrigin(0.5);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.collideWorldBounds = true;
    this.setScale(1);
    this.jumping = false;
    this.sliding = false;
    this.invincible = false;
    this.health = 100;
    this.body.mass = 10;
    this.body.setDragY = 10;
  }

  jump() {
    this.play("jump_ninja");
    this.body.velocity.y = -300;
    this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
      this.land();
    });
  }

  land() {
    this.play("run_ninja");
  }
}
