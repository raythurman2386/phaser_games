let game;
const gameOptions = {
  // bird gravity, will make bird fall if you don't flap
  birdGravity: 800,

  // horizontal bird speed
  birdSpeed: 125,

  // flap thrust
  birdFlapPower: 300,

  // minimum pipe height, in pixels. Affects hole position
  minPipeHeight: 50,

  // distance range from next pipe, in pixels
  pipeDistance: [220, 280],

  // hole range between pipes, in pixels
  pipeHole: [100, 130],

  // local storage object name
  localStorageName: "bestFlappyScore",
  backgroundSpeed: 1,
};

window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: 0x87ceeb,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 320,
      height: 480,
    },
    pixelArt: false,
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
        gravity: {
          y: 0,
        },
      },
    },
    scene: [Preloader, MainMenu, playGame, GameOver],
  };
  game = new Phaser.Game(gameConfig);
  window.focus();
};

class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.image("background", "assets/bg.png");
    this.load.multiatlas("bird", "assets/dragon.json", "assets");
    this.load.image("pipe", "assets/barrier.png");
    this.load.image("bg_front_layer", "assets/layer-5.png");
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("MainMenu");
  }
}

class MainMenu extends Phaser.Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "background"
    );

    let bird = this.add.sprite(
      this.game.config.width / 2,
      this.game.config.height / 4,
      "bird",
      "a1.png"
    );

    this.anims.create({
      key: "dragon-fly",
      frameRate: 8,
      frames: this.anims.generateFrameNames("bird", {
        start: 0,
        end: 7,
        prefix: "a",
        suffix: ".png",
      }),
      repeat: -1,
    });

    bird.play("dragon-fly");

    this.add
      .text(this.game.config.width / 2, this.game.config.height / 1.5, "Play", {
        fontFamily: "Arial Black",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("PlayGame");
    });
  }
}

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
    this.leftmostPipe = null;
  }

  create() {
    this.background = this.add.tileSprite(
      game.config.width / 2,
      game.config.height / 2,
      0,
      0,
      "background"
    );
    this.background.setScale(
      Math.max(
        game.config.width / this.background.width,
        game.config.height / this.background.height
      )
    );
    this.pipeGroup = this.physics.add.group();
    this.pipePool = [];
    for (let i = 0; i < 4; i++) {
      this.pipePool.push(this.pipeGroup.create(0, 0, "pipe"));
      this.pipePool.push(this.pipeGroup.create(0, 0, "pipe"));
      this.placePipes(false);
    }

    this.pipeGroup.setVelocityX(-gameOptions.birdSpeed);
    this.bird = this.physics.add.sprite(
      80,
      game.config.height / 2,
      "bird",
      "a1.png"
    );
    this.bird.setDisplaySize(30, 30);
    this.bird.play("dragon-fly");

    this.bird.body.gravity.y = gameOptions.birdGravity;
    this.input.on("pointerdown", this.flap, this);
    this.score = 0;
    this.topScore =
      localStorage.getItem(gameOptions.localStorageName) == null
        ? 0
        : localStorage.getItem(gameOptions.localStorageName);
    this.scoreText = this.add.text(10, 10, "");
    this.updateScore(this.score);

    this.leftmostPipe = this.pipeGroup.getChildren()[0];
    this.time.addEvent({
      delay: 1000,
      callback: this.delayDone,
      callbackScope: this,
      loop: false,
    });

    this.foreground = this.add.tileSprite(
      game.config.width / 2,
      game.config.height / 2,
      0,
      0,
      "bg_front_layer"
    );
    this.foreground.setScale(
      Math.max(
        game.config.width / this.background.width,
        game.config.height / this.background.height
      )
    );
  }
  delayDone() {
    this.bird.setSize(this.bird.width, this.bird.height, true);
  }

  updateScore(inc) {
    this.score += inc;
    this.scoreText.text = "Score: " + this.score + "\nBest: " + this.topScore;
  }

  placePipes(addScore) {
    let rightmostPipe = this.getRightmostPipe();
    let pipeHoleHeight = Phaser.Math.Between(
      gameOptions.pipeHole[0],
      gameOptions.pipeHole[1]
    );

    let pipeHolePosition = Phaser.Math.Between(
      gameOptions.minPipeHeight + pipeHoleHeight / 2,
      game.config.height - gameOptions.minPipeHeight - pipeHoleHeight / 2
    );

    // Calculate the new pipe position based on the rightmost pipe
    let newPipeX =
      rightmostPipe +
      this.pipePool[0].getBounds().width +
      Phaser.Math.Between(
        gameOptions.pipeDistance[0],
        gameOptions.pipeDistance[1]
      );

    this.pipePool[0].x = newPipeX;
    this.pipePool[0].y = pipeHolePosition - pipeHoleHeight / 2;
    this.pipePool[0].setOrigin(0, 1).setFlipY(true);
    this.pipePool[1].x = newPipeX;
    this.pipePool[1].y = pipeHolePosition + pipeHoleHeight / 2;
    this.pipePool[1].setOrigin(0, 0);
    this.pipePool = [];
    if (addScore) {
      this.updateScore(1);
    }
  }

  flap() {
    this.bird.body.velocity.y = -gameOptions.birdFlapPower;
  }

  getRightmostPipe() {
    let rightmostPipe = 0;
    this.pipeGroup.getChildren().forEach(function (pipe) {
      rightmostPipe = Math.max(rightmostPipe, pipe.x);
    });
    return rightmostPipe;
  }

  update() {
    this.background.tilePositionX += gameOptions.backgroundSpeed;
    this.foreground.tilePositionX += gameOptions.backgroundSpeed;
    this.physics.world.collide(
      this.bird,
      this.pipeGroup,
      function () {
        this.die();
      },
      null,
      this
    );
    if (this.bird.y > game.config.height || this.bird.y < 0) {
      this.die();
    }

    this.pipeGroup.getChildren().forEach(function (pipe) {
      if (pipe.getBounds().right < 0) {
        this.pipePool.push(pipe);
        if (this.pipePool.length == 2) {
          this.placePipes(true);
        }
      }
    }, this);

    if (this.leftmostPipe.getBounds().right < 0) {
      this.pipePool.push(this.leftmostPipe);
      this.leftmostPipe = this.pipeGroup.getChildren()[0];
      if (this.pipePool.length == 2) {
        this.placePipes(true);
      }
    }
  }

  die() {
    localStorage.setItem(
      gameOptions.localStorageName,
      Math.max(this.score, this.topScore)
    );
    this.scene.start("GameOver");
  }
}

class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    this.cameras.main.setBackgroundColor(0xff0000);

    this.add
      .image(
        this.game.config.width / 2,
        this.game.config.height / 2,
        "background"
      )
      .setAlpha(0.5);

    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2,
        "Game Over",
        {
          fontFamily: "Arial Black",
          fontSize: 24,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("MainMenu");
    });
  }
}
