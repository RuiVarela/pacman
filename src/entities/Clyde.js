import Ghost from "./Ghost";

class Clyde extends Ghost {
  constructor(scene, size, position) {
    super(scene, size, "clyde", position);
  }

  doUpdate(time, delta) { // eslint-disable-line no-unused-vars
    //console.log("Clyde");
  }
}

export default Clyde;