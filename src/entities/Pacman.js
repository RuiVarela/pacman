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
        { key: "BaseAtlas", frame: "pacman/filled" },
        { key: "BaseAtlas", frame: "pacman/right_0" }
      ],
      frameRate: 16,
      repeat: -1
    });

    this.moving = false;
    this.anims.play(this.animation);
    this.anims.pause(this.animation.frames[2]);
  }


  checkMove(move) {
    let result = this.currentPosition();

    result.move = move;
    result.angle = 0;
    result.stop = false;
    result.x_dir = 0;
    result.y_dir = 0;

    let distance = this.cell_size * 0.50001;

    if (move == Character.Move.Up) {
      result.angle = 270;
      result.y -= distance;
      result.y_dir = -1.0;
    } else if (move == Character.Move.Down) {
      result.angle = 90;
      result.y += distance;
      result.y_dir = 1.0;
    } 
    else if (move == Character.Move.Left) {
      result.angle = 180;
      result.x -= distance;
      result.x_dir = -1.0;
    } else if (move == Character.Move.Right) {
      result.angle = 0;
      result.x += distance;
      result.x_dir = 1.0;
    } 
    else {
      result.stop = true;
    }



    if (!result.stop) {
      let snaped = this.getSnapPositionToTile(result.x, result.y);

      result.x = snaped.x;
      result.y = snaped.y;

      // colision test
      let cell = this.scene.getCell(snaped.cell_x, snaped.cell_y);
      if (cell instanceof Wall) {
        result.stop = true;
      }
    }


    if (result.stop) {
      result.x_dir = 0;
      result.y_dir = 0;
    }

    return result;
  }

  processMovement(delta_time) {
    
    let move_info = this.checkMove(this.move);
    if (move_info.stop && this.move_info) {
      move_info = this.checkMove(this.move_info.move);
    }

    //console.group("Move "  + JSON.stringify(move));
    //console.table(move_info);
    //console.groupEnd();

    if (move_info.stop) {
      super.setNextMove(null);
      this.move_info = null;
      this.snapToTile();


      if (this.anims.isPlaying) {
        this.anims.pause(this.animation.frames[1]);
      }
      return;
    }

    if (!this.anims.isPlaying) {
      this.anims.resume();
    }

    // snap positions to tile center
    if (!this.move_info || this.move_info.move != move_info.move) {
      this.snapToTile();
    }

    this.angle = move_info.angle;
    this.move_info = move_info;

    // 1 tile -> 100ms
    let time_multiplier = delta_time / 100.0;
    //let time_multiplier = delta_time / 1000.0;

    this.x += this.cell_size * time_multiplier * move_info.x_dir;
    this.y += this.cell_size * time_multiplier * move_info.y_dir;
  }

  doUpdate(time, delta) { // eslint-disable-line no-unused-vars
    this.processMovement(delta);
  }
}

export default Pacman;