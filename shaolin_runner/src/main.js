import { Game, GameOver } from "./scenes";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 320,
  parent: "game-container",
  backgroundColor: "#028af8",
  pixelArt: false,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 800 },
    },
    debug: false,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Game, GameOver],
};

export default new Phaser.Game(config);
