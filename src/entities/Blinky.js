import Ghost from "./Ghost";

class Blinky extends Ghost {
  constructor(scene, size, position) {
    super(scene, size, "blinky", position);
  }
}

export default Blinky;