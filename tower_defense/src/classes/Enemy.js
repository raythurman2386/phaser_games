export class Enemy extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, frame, path) {
    super(scene, x, y, texture, frame);
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    this.path = path;
    this.ENEMY_SPEED = 1 / 10000;
    this.setScale(2);
    this.hp = 100;
  }

  preload() {}

  create() {}

  update(time, delta) {
    this.follower.t += this.ENEMY_SPEED * delta;
    this.path.getPoint(this.follower.t, this.follower.vec);
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
    if (this.follower.t >= 1) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  startOnPath() {
    this.follower.t = 0;
    this.path.getPoint(this.follower.t, this.follower.vec);
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
  }

  receiveDamage(damage) {
    this.hp -= damage;

    if (this.hp <= 0) {
      this.destroy();
    }
  }
}
