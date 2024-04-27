class CurtainTransitionScene extends Phaser.Scene {
  constructor() {
    super("CurtainTransitionScene");
  }

  init(data) {
    // Get the scene to transition to
    this.nextScene = data.nextScene;
  }

  preload() {
    // Load the curtain images
    this.load.image("curtain_left", "curtain_left.png");
    this.load.image("curtain_right", "curtain_right.png");
  }

  create() {
    // Create the curtain images
    this.curtainLeft = this.add
      .image(0, this.game.renderer.height / 2, "curtain_left")
      .setOrigin(0, 0.5);
    this.curtainRight = this.add
      .image(
        this.game.renderer.width,
        this.game.renderer.height / 2,
        "curtain_right"
      )
      .setOrigin(1, 0.5);

    // Start the transition
    this.startTransition();
  }

  startTransition() {
    // Move the curtains off screen
    this.tweens.add({
      targets: this.curtainLeft,
      x: -this.curtainLeft.width,
      duration: 2000,
      ease: "Linear",
    });
    this.tweens.add({
      targets: this.curtainRight,
      x: this.game.renderer.width + this.curtainRight.width,
      duration: 2000,
      ease: "Linear",
      onComplete: () => {
        // Start the next scene
        this.scene.start(this.nextScene);
      },
    });
  }
}
