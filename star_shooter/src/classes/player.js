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
    this.play("run_ninja");
  }

  jump() {
    if (!this.body.blocked.down) return;
    this.play("jump_ninja");
    this.body.velocity.y = -400;
    this.jumping = true;

    this.once("animationcomplete", () => {
      this.jumping = false;
      this.play("run_ninja");
    });
  }

  slide() {
    if (!this.body.blocked.down) return;
    this.play("slide_ninja");
    this.sliding = true;

    this.body.setSize(this.width, this.height / 2);
    this.body.setOffset(0, this.height / 2);

    this.once("animationcomplete", () => {
      if (this.anims.currentAnim.key === "slide_ninja") {
        this.sliding = false;
        this.play("run_ninja");

        this.body.setSize(this.width, this.height);
        this.body.setOffset(0, 0);
      }
    });
  }
}
