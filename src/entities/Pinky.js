import Ghost from "./Ghost";

class Pinky extends Ghost {
  constructor(scene, size, position) {
    super(scene, size, "pinky", position);

    this.move_info = null;
  }

  doUpdate(time, delta) { // eslint-disable-line no-unused-vars
    //console.log("pinky");
  }

  
}

export default Pinky;