import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");

  }

  init(data) {
    this.name = data.name;
    this.number = data.number;
  }

  preload() {
  }

  create() {
  }



  loadAudios() {

  }

  playAudio(key) {

  }

  playMusic(theme = "theme") {

  }

  update() {

  }
}
