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
    let current = this.currentPosition();

    let result = {
      x: current.x,
      y: current.y,
      cell_x: current.cell_x,
      cell_y: current.cell_y,
      cell_x_factor: current.cell_x_factor,
      cell_y_factor: current.cell_y_factor,

      target_x: current.x,
      target_y: current.y,
      move: move,
      angle: 0,
      stop: false,
      x_dir: 0,
      y_dir: 0,

      on_change_point: false
    };


    let distance = this.cell_size * 0.50001;

    if (move == Character.Move.Up) {
      result.angle = 270;
      result.target_y -= distance;
      result.y_dir = -1.0;
    } else if (move == Character.Move.Down) {
      result.angle = 90;
      result.target_y += distance;
      result.y_dir = 1.0;
    }
    else if (move == Character.Move.Left) {
      result.angle = 180;
      result.target_x -= distance;
      result.x_dir = -1.0;
    } else if (move == Character.Move.Right) {
      result.angle = 0;
      result.target_x += distance;
      result.x_dir = 1.0;
    }
    else {
      result.stop = true;
    }

    // compute the target position
    if (!result.stop) {
      let target = this.getSnapPositionToTile(result.target_x, result.target_y);
      result.target_x = target.x;
      result.target_y = target.y;

      result.target_cell_x = target.cell_x;
      result.target_cell_y = target.cell_y;

      result.target_cell_x_factor = target.cell_x_factor;
      result.target_cell_y_factor = target.cell_y_factor;
    }

    // check if we are on a change point
    if (!result.stop && this.move_info) {
      if (this.move_info.move == Character.Move.Up) {
        result.on_change_point = this.move_info.cell_y_factor >= 0.5 && result.cell_y_factor < 0.5;
      } else if (this.move_info.move == Character.Move.Down) {
        result.on_change_point = this.move_info.cell_y_factor <= 0.5 && result.cell_y_factor > 0.5;
      } else if (this.move_info.move == Character.Move.Left) {
        result.on_change_point = this.move_info.cell_x_factor >= 0.5 && result.cell_x_factor < 0.5;
      } else if (this.move_info.move == Character.Move.Right) {
        result.on_change_point = this.move_info.cell_x_factor <= 0.5 && result.cell_x_factor > 0.5;
      }
    }

    // we can only change directions on the cell center
    if (!result.stop && this.move_info && this.move_info.move != move) {
      if (!result.on_change_point) {
        result.stop = true;
        //console.log("Change " + current.cell_x_factor + " " + current.cell_y_factor);
      }
    }

    // wrap map
    if (!result.stop) {
      let cell = this.scene.getCell(result.cell_x, result.cell_y);

      if (cell === null) {
        // can't change directions outside the map
        if (this.move_info && this.move_info.move != move) {
          result.stop = true;
        } else if (result.on_change_point) {
          if (move == Character.Move.Right && result.cell_x === this.scene.cols) {
            let cell_position = this.cellPosition(-1, result.cell_y);
            this.x = cell_position.x;
            this.y = cell_position.y;
          } else if (move == Character.Move.Left && result.cell_x === -1) {
            let cell_position = this.cellPosition(this.scene.cols, result.cell_y);
            this.x = cell_position.x;
            this.y = cell_position.y;
          }
        }
      }
    }


    // wall colision test
    if (!result.stop) {
      let cell = this.scene.getCell(result.target_cell_x, result.target_cell_y);
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

  doUpdate(time, delta) { // eslint-disable-line no-unused-vars

    let move_info = this.checkMove(this.move);
    if (move_info.stop && this.move_info) {
      move_info = this.checkMove(this.move_info.move);
    }

    //console.group("Move "  + JSON.stringify(move));
    //console.table(move_info);
    //console.groupEnd();

    if (move_info.stop) {
      this.setNextMove(null);
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
    let time_multiplier = delta / 150.0;
    //let time_multiplier = delta_time / 1000.0;

    this.x += this.cell_size * time_multiplier * move_info.x_dir;
    this.y += this.cell_size * time_multiplier * move_info.y_dir;

  }

  setNextMove(move) {
    if (this.move === move)
      return false;

    this.move = move;
    //console.log("setNextMove " + this.move);
    return true;
  }
}

export default Pacman;