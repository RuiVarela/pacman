import Character from "./Character";

class Pacman extends Character {
  constructor(scene, size, position) {
    super(scene, size, "pacman/filled", position);

    this.animation = scene.anims.create({
      key: "pacman_move",
      frames: [
        { key: "BaseAtlas", frame: "pacman/right_1" },
        { key: "BaseAtlas", frame: "pacman/right_0" },
        { key: "BaseAtlas", frame: "pacman/filled" }
      ],
      frameRate: 8,
      repeat: -1
    });

    this.moving = false;

    this.anims.play(this.animation);
    this.anims.pause(this.animation.frames[2]);
  }

  currentPosition() {
    return {
      x: this.x + this.displayWidth * 0.5,
      y: this.y + this.displayHeight * 0.5
    };
  }

  currentCell() {
    let current_position = this.currentPosition();
    return {
      x: current_position.x / this.cell_size,
      y: current_position.y / this.cell_size
    };
  }

  processMove() {
    console.log("processMove");
    let position = this.currentPosition();

    if (this.move == Character.Move.Up) {
      this.angle = 270;
      position.y -= this.cell_size;
    } else if (this.move == Character.Move.Down) {
      this.angle = 90;
      position.y += this.cell_size;
    } else if (this.move == Character.Move.Left) {
      this.angle = 180;
      position.x -= this.cell_size;
    } else if (this.move == Character.Move.Right) {
      this.angle = 0;
      position.x += this.cell_size;
    } else {

      this.moving = false;

      if (this.anims.isPlaying) {
        this.anims.pause(this.animation.frames[1]);
      }

      return;
    }

    if (!this.anims.isPlaying) {
      this.anims.resume();
    }

    this.moving = true;

    // center position
    position.x -= this.displayWidth * 0.5;
    position.y -= this.displayHeight * 0.5;

    let duration = 1000;

    this.scene.tweens.add({
      targets: this,
      y: position.y,
      x: position.x,
      duration: duration,
      ease: "Linear",
      onComplete: () => { this.processMove(); }
    });
  }

  setNextMove(move) {
    if (!super.setNextMove(move))
      return;

    if (!this.moving) {
      this.processMove();
    }
  }
}

export default Pacman;