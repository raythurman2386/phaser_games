export class Enemy extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, frame, path) {
    super(scene, x, y, texture, frame);
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    this.path = path;
    this.ENEMY_SPEED = 1 / (10000 + Phaser.Math.Between(0, 2000));
    this.hp = 400;
  }

  preload() {}

  create() {}

  update(time, delta) {
    // Calculate the enemy's next position on the path
    const prevX = this.follower.vec.x;
    const prevY = this.follower.vec.y;
    this.follower.t += this.ENEMY_SPEED * delta;
    this.path.getPoint(this.follower.t, this.follower.vec);

    // Calculate the angle between the current position and the next position
    const angle = Phaser.Math.Angle.Between(
      prevX,
      prevY,
      this.follower.vec.x,
      this.follower.vec.y
    );

    // Set the enemy's rotation based on the calculated angle
    this.setRotation(angle);

    // Update the enemy's position
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
