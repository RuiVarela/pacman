import Ghost from "./Ghost";
import Character from "./Character";

class Blinky extends Ghost {
  constructor(scene, size, position) {
    super(scene, size, "blinky", position);
  }

  doUpdate(time, delta) { // eslint-disable-line no-unused-vars
    //console.log("Blinky");

    let move = null;
    if (this.move_info) {
      move = this.move_info.move;
    } else {
      // we are starting
      move = Character.Move.Left;
    }

    let move_info = this.checkMove(move);

    


    if (move_info.stop) {
      return;
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

export default Blinky;