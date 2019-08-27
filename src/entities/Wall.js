import App from "../Application";
import Phaser from "phaser";

class Wall extends Phaser.GameObjects.Sprite {

    static nameFromKey(code) {
        if (code === 'q') {
            return "map/outer_top_left";
        } else if (code === 'w') {
            return "map/outer_top";
        } else if (code === 'e') {
            return "map/outer_top_right";
        } else if (code === 'a') {
            return "map/outer_left";
        } else if (code === 'd') {
            return "map/outer_right";
        } else if (code === 'z') {
            return "map/outer_bottom_left";
        } else if (code === 'c') {
            return "map/outer_bottom_right";
        } else if (code === 'x') {
            return "map/outer_bottom";
        }

        else if (code === 'r') {
            return "map/inner_top_left";
        } else if (code === 't') {
            return "map/inner_top";
        } else if (code === 'y') {
            return "map/inner_top_right";
        } else if (code === 'h') {
            return "map/inner_right";
        } else if (code === 'f') {
            return "map/inner_left";
        } else if (code === 'v') {
            return "map/inner_bottom_left";
        } else if (code === 'n') {
            return "map/inner_bottom_right";
        } else if (code === 'b') {
            return "map/inner_bottom";
        }

        else if (code === 'u') {
            return "map/outer_junction_top_left";
        } else if (code === 'i') {
            return "map/outer_junction_top_right";
        }

        return null;
    }

    constructor(scene, x, y, size, key) {
        super(scene,
            size * x + size * 0.5, size * y + size * 0.5,
            'BaseAtlas', Wall.nameFromKey(key));

        this.cell_x = x;
        this.cell_y = y;

        this.displayWidth = size;
        this.displayHeight = size;

        scene.add.existing(this);
    }
}

export default Wall;