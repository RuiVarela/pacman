import Phaser from "phaser";

class Entity extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, size, image) {
        super(scene,
            size * x + size * 0.5, size * y + size * 0.5,
            'BaseAtlas', image);

        this.cell_x = x;
        this.cell_y = y;

        this.displayWidth = size;
        this.displayHeight = size;

        scene.add.existing(this);
    }
}

export default Entity;