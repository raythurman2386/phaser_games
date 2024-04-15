import { Scene } from "phaser";
import { Enemy } from "../classes/Enemy";
import { Turret } from "../classes/Turret";
import { Bullet } from "../classes/Bullet";

export class Game extends Scene {
  constructor() {
    super("Game");
    this.path = null;
    this.graphics = null;
    this.enemies = null;
    this.turrets = null;
    this.bullets = null;
    this.map = [
      [0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0],
    ];
  }

  drawPath() {
    this.graphics = this.add.graphics();
    this.path = this.add.path(96, -32);

    this.path.lineTo(96, 164);
    this.path.lineTo(480, 164);
    this.path.lineTo(480, 544);
    this.path.lineTo(480, 770);

    this.graphics.lineStyle(3, 0xffffff, 1);
    this.path.draw(this.graphics);
  }

  drawGrid() {
    const cellWidth = 1024 / 16; // 64
    const cellHeight = 768 / 12; // 64

    this.graphics.lineStyle(1, 0x0000ff, 0.8);

    // Draw horizontal lines
    for (let i = 0; i < 13; i++) {
      this.graphics.moveTo(0, i * cellHeight);
      this.graphics.lineTo(1024, i * cellHeight);
    }

    // Draw vertical lines
    for (let j = 0; j < 17; j++) {
      this.graphics.moveTo(j * cellWidth, 0);
      this.graphics.lineTo(j * cellWidth, 768);
    }

    this.graphics.strokePath();
  }

  placeTurret(pointer) {
    const i = Math.floor(pointer.y / 64);
    const j = Math.floor(pointer.x / 64);
    if (this.canPlaceTurret(i, j)) {
      const turret = this.turrets.get();
      if (turret) {
        turret.setActive(true);
        turret.setVisible(true);
        turret.place(i, j, this.map);
      }
    }
  }

  canPlaceTurret(i, j) {
    return this.map[i][j] === 0;
  }

  damageEnemy(enemy, bullet) {
    if (enemy.active === true && bullet.active === true) {
      bullet.setActive(false);
      bullet.setVisible(false);
      enemy.receiveDamage(bullet.damage);
    }
  }

  initEnemies() {
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
      createCallback: (enemy) => {
        enemy.setTexture("enemy");
        enemy.path = this.path;
      },
    });
    this.nextEnemy = 0;
  }

  initTurrets() {
    this.turrets = this.physics.add.group({
      classType: Turret,
      runChildUpdate: true,
      createCallback: (turret) => {
        turret.map = this.map;
        turret.enemies = this.enemies;
        turret.bullets = this.bullets;
        turret.setTexture("turret");
      },
    });
  }

  initBullets() {
    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
      createCallback: (bullet) => {
        bullet.setTexture("bullet");
      },
    });
  }

  create() {
    this.drawPath();

    this.initEnemies();
    // this.drawGrid(this.graphics);
    this.initBullets();
    this.initTurrets();
    this.input.on("pointerdown", (pointer) => {
      const i = Math.floor(pointer.y / 64);
      const j = Math.floor(pointer.x / 64);
      if (this.canPlaceTurret(i, j)) {
        const turret = this.turrets.get();
        if (turret) {
          turret.setActive(true);
          turret.setVisible(true);
          turret.place(i, j);
        }
      }
    });

    this.physics.add.overlap(this.enemies, this.bullets, this.damageEnemy);
  }

  update(time, delta) {
    if (time > this.nextEnemy) {
      let enemy = this.enemies.get();
      if (enemy) {
        enemy.setActive(true);
        enemy.setVisible(true);

        enemy.startOnPath();
        this.nextEnemy = time + 2000;
      }
    }
  }
}
