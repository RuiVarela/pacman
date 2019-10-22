import Ghost from "./Ghost";

class Blinky extends Ghost {

  constructor(scene, size, position) {
    super(scene, size, "blinky", position);
    
    this.current_state = Ghost.State.Starting;
  }

}

export default Blinky;