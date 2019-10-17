import Entity from "./Entity";
import Wall from "./Wall";

const Move = Object.freeze({
  Up: "Up",
  Down: "Down",
  Left: "Left",
  Right: "Right",
});

class Character extends Entity {

  constructor(scene, size, image, position) {
    super(scene, null, null, size, image, position);
  }

  getInvertedMove(move) {
    switch (move) {
      case Character.Move.Up: return Character.Move.Down;
      case Character.Move.Down: return Character.Move.Up;
      case Character.Move.Left: return Character.Move.Right;
      case Character.Move.Right: return Character.Move.Left;
    }
    return Character.Move.Up;
  }

  currentPosition() {
    let position = this.getSnapPositionToTile(this.x, this.y);
    position.x = this.x;
    position.y = this.y;
    return position;
  }

  cellPosition(x, y) {
    return Entity.cellPosition(x, y, this.cell_size);
  }

  getSnapPositionToTile(x, y) {
    let cell_size = this.cell_size;
    let cell_x_factor = x / cell_size;
    let cell_y_factor = y / cell_size;
    let cell_x = Math.trunc(x / cell_size);
    let cell_y = Math.trunc(y / cell_size);

    cell_x_factor -= cell_x;
    cell_y_factor -= cell_y;

    return {
      x: cell_x * cell_size + cell_size * 0.5,
      y: cell_y * cell_size + cell_size * 0.5,
      cell_x: cell_x,
      cell_y: cell_y,
      cell_x_factor: Math.abs(cell_x_factor),
      cell_y_factor: Math.abs(cell_y_factor)
    };
  }

  snapToTile() {
    let snaped = this.getSnapPositionToTile(this.x, this.y);
    this.x = snaped.x;
    this.y = snaped.y;
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

      on_change_point: false,
      screen_wrap_point: false
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
    if (!result.stop && this.move_info && !this.move_info.on_change_point) {
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

    // wrap map text
    if (!result.stop) {
      let cell = this.scene.getCell(result.cell_x, result.cell_y);

      if (cell === null) {
        // can't change directions outside the map
        if (this.move_info && this.move_info.move != move) {
          result.stop = true;
        } else if (result.on_change_point) {
          if (move == Character.Move.Right && result.cell_x === this.scene.cols) {
            result.screen_wrap_point = true;
          } else if (move == Character.Move.Left && result.cell_x === -1) {
            result.screen_wrap_point = true;
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

  applyMoveInfo(delta, move_info) {
    // snap positions to tile center when changing directions
    if (this.move_info && (this.move_info.move != move_info.move)) {
      this.snapToTile();
    }
    // wrap map when leaving screen
    else if (move_info.screen_wrap_point && move_info.move == Character.Move.Right) {
      let cell_position = this.cellPosition(-1, move_info.cell_y);
      this.x = cell_position.x;
      this.y = cell_position.y;
    } else if (move_info.screen_wrap_point && move_info.move == Character.Move.Left) {
      let cell_position = this.cellPosition(this.scene.cols, move_info.cell_y);
      this.x = cell_position.x;
      this.y = cell_position.y;
    }

    this.move_info = move_info;

    // 10 tile per seconds at fullspeed
    // level 1 speed if 80%
    let speed_factor = 0.8;
    let tile_duration = 1000.0 / (speed_factor * 10.0);
    let time_multiplier = delta / tile_duration;

    this.x += this.cell_size * time_multiplier * move_info.x_dir;
    this.y += this.cell_size * time_multiplier * move_info.y_dir;
  }
}

Character.Move = Move;
export default Character;