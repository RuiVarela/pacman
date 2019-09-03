import Entity from "./Entity";

const Move = Object.freeze({
    Up: "Up",
    Down: "Down",
    Left: "Left",
    Right: "Right",
});

class Character extends Entity {

    constructor(scene, size, image, position) {
        super(scene, null, null, size, image, position);
        this.setNextMove(null);
    }

    setNextMove(move) {
        if (this.move === move)
            return false;

        this.move = move;
        //console.log("setNextMove " + this.move);
        return true;
    }
}

Character.Move = Move;
export default Character;