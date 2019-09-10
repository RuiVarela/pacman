import Phaser from "phaser";

class Entity extends Phaser.GameObjects.Sprite {

    static computePositionFromArray(array) {
        let position = {
            x: 0,
            y: 0
        };

        for (let index = 0; index != array.length; ++index) {
            let value = array[index];
            if (index % 2 == 0) {
                position.x += value;
            } else {
                position.y += value;
            }
        }

        if (array.length > 0) {
            position.x /= (array.length / 2.0);
            position.y /= (array.length / 2.0);
        }

        return position;
    }

    static cellPosition(x, y, size) {
        return {
            x : size * x + size * 0.5,
            y : size * y + size * 0.5
        };
    }

    constructor(scene, x, y, size, image, positions_array) {
        var position = Entity.cellPosition(x, y, size);

        if (positions_array) {
            position = Entity.computePositionFromArray(positions_array);
            position.x = position.x * size + size * 0.5;
            position.y = position.y * size + size * 0.5;
        }

        super(scene, position.x, position.y, "BaseAtlas", image);

        this.cell_size = size;
        this.character_size = size * 2;

        if (positions_array) {
            this.displayWidth = this.character_size;
            this.displayHeight = this.character_size;
        }
        else {
            this.displayWidth = size;
            this.displayHeight = size;
        }

        scene.add.existing(this);
    }
}

export default Entity;