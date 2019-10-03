import Character from "./Character";
import Dot from "./Dot";
import Energizer from "./Energizer";

class Pacman extends Character {
  constructor(scene, size, position) {
    super(scene, size, "pacman/filled", position);

    this.setNextMove(null);
    this.animation = scene.anims.create({
      key: "pacman_move",
      frames: [
        { key: "BaseAtlas", frame: "pacman/right_1" },
        { key: "BaseAtlas", frame: "pacman/right_0" },
        { key: "BaseAtlas", frame: "pacman/filled" },
        { key: "BaseAtlas", frame: "pacman/right_0" }
      ],
      frameRate: 20,
      repeat: -1
    });

    this.chomp_sound = scene.sound.add("ChompSound");

    this.score = 0;
    this.moving = false;
    this.anims.play(this.animation);
    this.anims.pause(this.animation.frames[2]);
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

      if (this.chomp_sound.isPlaying) {
        this.chomp_sound.stop();
      }
    }

    let cell = this.scene.getCell(move_info.cell_x, move_info.cell_y);

    // check if we are on a dot
    if (move_info.on_change_point && cell instanceof Dot) {
      this.score += 10;
      this.scene.setSpaceCell(move_info.cell_x, move_info.cell_y);
    }

    // if we should stop, don't do anything else
    if (move_info.stop) {
      return;
    }



    // check chomp sound
    if (cell instanceof Dot || cell instanceof Energizer) {
      this.last_chomp = move_info;

      if (!this.chomp_sound.isPlaying) {
        this.chomp_sound.setLoop(true);
        this.chomp_sound.play();
      }

    } else if (this.last_chomp && move_info.on_change_point && (this.last_chomp.cell_x != move_info.cell_x || this.last_chomp.cell_y != move_info.cell_y))  {
     
      this.last_chomp = null;
      if (this.chomp_sound.isPlaying) {
        this.chomp_sound.stop();
      }
    }


    if (!this.anims.isPlaying) {
      this.anims.resume();
    }

    // snap positions to tile center when changing directions
    if (!this.move_info || this.move_info.move != move_info.move) {
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

    this.angle = move_info.angle;
    this.move_info = move_info;

    // 10 tile per seconds at fullspeed
    // level 1 speed if 80%
    let speed_factor = 0.8;
    let tile_duration = 1000.0 / (speed_factor * 10.0);
    let time_multiplier = delta / tile_duration;

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