import Character from "./Character";
import Wall from "./Wall";

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
      frameRate: 16,
      repeat: -1
    });

    this.moving = false;

    this.anims.play(this.animation);
    this.anims.pause(this.animation.frames[2]);
  }

  currentPosition() {
    return { x: this.x, y: this.y };
  }

  processMove() {
    console.log("processMove");
    let position = this.currentPosition();

    let multiplier = 0.75;
    let should_stop = false;

    if (this.move == Character.Move.Up) {
      this.angle = 270;
      position.y -= this.cell_size * multiplier;
    } else if (this.move == Character.Move.Down) {
      this.angle = 90;
      position.y += this.cell_size * multiplier;
    } else if (this.move == Character.Move.Left) {
      this.angle = 180;
      position.x -= this.cell_size * multiplier;
    } else if (this.move == Character.Move.Right) {
      this.angle = 0;
      position.x += this.cell_size * multiplier;
    } else {
      should_stop = true;
    }

    if (!should_stop) {
      // snap
      let cell_x = Math.trunc(position.x / this.cell_size);
      let cell_y = Math.trunc(position.y / this.cell_size);

      position.x = cell_x * this.cell_size + this.cell_size * 0.5;
      position.y = cell_y * this.cell_size + this.cell_size * 0.5;

      let cell = this.scene.getCell(cell_x, cell_y);
      if (cell instanceof Wall) {
        should_stop = true;
      }
    }

    if (should_stop) {
      super.setNextMove(null);
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
    //  position.x -= this.displayWidth * 0.5;
    //  position.y -= this.displayHeight * 0.5;


    let duration = 1000 / 10; // assuming 10 tiles per second

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