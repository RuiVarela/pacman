import App from "../Application";

class Space {
    constructor(scene, x, y, size) {
        this.x = size * x + size * 0.5;
        this.y= size * y + size * 0.5;

        this.cell_x = x;
        this.cell_y = y;

        this.displayWidth = size;
        this.displayHeight = size;
    }
}

export default Space;