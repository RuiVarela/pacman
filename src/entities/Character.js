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
    }

    currentPosition() {
        let position = this.getSnapPositionToTile(this.x, this.y);
        position.x = this.x;
        position.y = this.y;
        return position;
    }

    cellPosition(x, y) {
        return Entity.cellPosition(x, y, this.cell_size);
    }

    getSnapPositionToTile(x, y) {
        let cell_size = this.cell_size;
        let cell_x_factor = x / cell_size;
        let cell_y_factor = y / cell_size;
        let cell_x = Math.trunc(x / cell_size);
        let cell_y = Math.trunc(y / cell_size);

        cell_x_factor -= cell_x;
        cell_y_factor -= cell_y;

        return {
            x: cell_x * cell_size + cell_size * 0.5,
            y: cell_y * cell_size + cell_size * 0.5,
            cell_x : cell_x,
            cell_y : cell_y,
            cell_x_factor : Math.abs(cell_x_factor),
            cell_y_factor : Math.abs(cell_y_factor)
        };
    }

    snapToTile() {
        let snaped = this.getSnapPositionToTile(this.x, this.y);
        this.x = snaped.x;
        this.y = snaped.y;
    }
}

Character.Move = Move;
export default Character;