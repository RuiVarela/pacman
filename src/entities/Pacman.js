import Entity from "./Entity";

class Pacman extends Entity {
    constructor(scene, size, pacman_position) {
        super(scene, null, null, size, "pacman/filled", pacman_position);

      //  super(scene, pos.x, pos.y, size, "pacman/filled");
    }
}

export default Pacman;