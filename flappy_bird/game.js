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
  bird_texture: "raven",
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
    scene: [Boot, Preloader, MainMenu, playGame, GameOver],
  };
  game = new Phaser.Game(gameConfig);
  window.focus();
};

class Boot extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("background", `assets/background/day/bg.png`);
  }

  create() {
    this.scene.start("Preloader");
  }
}

class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "background"
    );
    //  A simple progress bar. This is the outline of the bar.
    this.add
      .rectangle(
        this.game.config.width / 2,
        this.game.config.height / 2,
        this.game.config.width / 1.2,
        32
      )
      .setStrokeStyle(1, 0xffffff);
  }

  preload() {
    this.load.multiatlas(
      "eye_dragon",
      "assets/eye_dragon/eye_dragon.json",
      "assets/eye_dragon/sprites"
    );
    this.load.multiatlas(
      "raven",
      "assets/raven/raven.json",
      "assets/raven/sprites"
    );
    this.load.multiatlas(
      "bird_king",
      "assets/bird_king/bird_king.json",
      "assets/bird_king/sprites"
    );
    this.load.multiatlas(
      "pink_beast",
      "assets/pink_beast/pink_beast.json",
      "assets/pink_beast/sprites"
    );
    this.load.multiatlas(
      "cute_dragon",
      "assets/cute_dragon/cute_dragon.json",
      "assets/cute_dragon/sprites"
    );
    this.load.image("pipe", "assets/barrier/barrier.png");
    this.load.image("mute", "assets/blue_boxCross.png");
    this.load.image("unmute", "assets/blue_boxCheckmark.png");
    this.load.image(
      "bg_front_layer",
      `assets/background/${this.get_time()}/fg.png`
    );
  }

  get_time() {
    const currentHour = new Date().getHours();

    let timeOfDay = "";
    if (currentHour >= 6 && currentHour < 18) {
      timeOfDay = "day";
      return timeOfDay;
    } else {
      timeOfDay = "night";
      return timeOfDay;
    }
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.
    this.anims.create({
      key: "fly",
      frameRate: 10,
      frames: this.anims.generateFrameNames(gameOptions.bird_texture, {
        start: 1,
        end: 7,
        prefix: "a",
        suffix: ".png",
      }),
      repeat: -1,
    });
    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("MainMenu");
  }
}

class MainMenu extends Phaser.Scene {
  constructor(texture) {
    super("MainMenu", texture);
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
      gameOptions.bird_texture,
      "a1.png"
    );

    bird.play("fly");

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

    // this.input.once("pointerdown", () => {
    //   this.scene.start("PlayGame");
    // });
    this.addSoundButtons();
  }

  addSoundButtons() {
    this.muteButton = this.add.image(this.game.renderer.width - 50, 50, "mute");
    this.muteButton.setInteractive();
    this.muteButton.on("pointerdown", () => {
      this.toggleSound();
    });

    this.unmuteButton = this.add.image(
      this.game.renderer.width - 50,
      50,
      "unmute"
    );
    this.unmuteButton.setInteractive();
    this.unmuteButton.on("pointerdown", () => {
      this.toggleSound();
    });

    this.unmuteButton.setVisible(false);
  }

  toggleSound() {
    if (this.game.sound.mute) {
      this.game.sound.mute = false;
      this.muteButton.setVisible(false);
      this.unmuteButton.setVisible(true);
    } else {
      this.game.sound.mute = true;
      this.muteButton.setVisible(true);
      this.unmuteButton.setVisible(false);
    }
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
      gameOptions.bird_texture,
      "a1.png"
    );
    this.bird.setDisplaySize(30, 30);
    this.bird.play("fly");

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
