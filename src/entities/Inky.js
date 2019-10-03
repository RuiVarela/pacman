import Ghost from "./Ghost";

class Inky extends Ghost {
  constructor(scene, size, position) {
    super(scene, size, "inky", position);
  }

  doUpdate(time, delta) { // eslint-disable-line no-unused-vars
    //console.log("Inky");

  }
}

export default Inky;