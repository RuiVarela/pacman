import Phaser from "phaser";
import Map from "./Map";

class Application {

    constructor() {
        this.version = "0.0.1";

        this.squareSize = 8 * 2;
        this.horizontalTiles = 28;
        this.verticalTiles = 36;

        this.width = this.horizontalTiles * this.squareSize;
        this.height = this.verticalTiles * this.squareSize;

        console.log("Application constructor")
    }

    run() {
        const config = {
            type: Phaser.AUTO,
            parent: "pacman",
            width: this.width,
            height: this.height,
            scene: new Map()
        };

        this.game = new Phaser.Game(config);
    }
}

export default new Application();