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

    // nothing to do
    if (!this.move) {
      return;
    }

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
    // check if we are on an energizer
    else if (move_info.on_change_point && cell instanceof Energizer) {
      this.score += 100;
      this.scene.setSpaceCell(move_info.cell_x, move_info.cell_y);
      //TODO
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

    this.angle = move_info.angle;
    this.applyMoveInfo(delta, move_info);
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