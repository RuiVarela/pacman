import Character from "./Character";

class Pacman extends Character {
  constructor(scene, size, position) {
    super(scene, size, "pacman/right_1", position);
  }

  setNextMove(move) {
    if (!super.setNextMove(move))
      return;
    console.log("PAC setNextMove " + this.move);
  }
}

export default Pacman;