// utils.js
export function getEnemy(enemies, x, y, distance) {
  const enemyUnits = enemies.getChildren();
  for (let i = 0; i < enemyUnits.length; i++) {
    if (
      enemyUnits[i].active &&
      Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <=
        distance
    ) {
      return enemyUnits[i];
    }
  }
  return false;
}

export function addBullet(bullets, x, y, angle) {
  const bullet = bullets.get();
  if (bullet) {
    bullet.fire(x, y, angle);
  }
}
