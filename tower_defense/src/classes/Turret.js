import { getEnemy, addBullet } from "../utils";

export class Turret extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, frame, map, enemies, bullets) {
    super(scene, x, y, texture, frame);
    this.nextFire = 0;
    this.map = map;
    this.enemies = enemies;
    this.bullets = bullets;
  }

  place(i, j) {
    this.y = i * 64 + 64 / 2;
    this.x = j * 64 + 64 / 2;
    this.map[i][j] = 1;
  }

  update(time, delta) {
    if (time > this.nextFire) {
      this.fire();
      this.nextFire = time + 1000;
    }
  }

  fire() {
    const enemy = getEnemy(this.enemies, this.x, this.y, 128);
    if (enemy) {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      addBullet(this.bullets, this.x, this.y, angle);
      this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
    }
  }
}
