export class Bullet extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.dx = 0;
    this.dy = 0;
    this.lifespan = 0;
    this.speed = Phaser.Math.GetSpeed(600, 1);
    this.damage = 25;
    this.setScale(1.5);
  }

  fire(x, y, angle) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);
    this.lifespan = 300;
  }

  update(time, delta) {
    this.lifespan -= delta;
    this.x += this.dx * (this.speed * delta);
    this.y += this.dy * (this.speed * delta);
    if (this.lifespan <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
