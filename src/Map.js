import App from "./Application";
import Wall from "./entities/Wall";
import Space from "./entities/Space";
import Phaser from "phaser";

import BaseAtlasImage from "./assets/base_atlas.png";
import BaseAtlasJson from "./assets/base_atlas.json";

import Map00Json from "./assets/map00.json";

class Map extends Phaser.Scene {

    constructor(config) {
        super(config);
        console.log("Map constructor")

        this.level = [];
        this.squareSize = App.squareSize;
    }

    preload() {
        console.log("Map preload");
        this.load.atlas('BaseAtlas', BaseAtlasImage, BaseAtlasJson);
    }

    create() {
        console.log("Map create");

        if (false) {
            let atlas = this.textures.get('BaseAtlas');
            let frames = atlas.getFrameNames();
            for (var i = 0; i < frames.length; i++) {
                console.log(frames[i]);
            }
        }

        let data = Map00Json.data;
        this.rows = data.length;
        this.cols = data[0].length

        for (let y = 0; y != this.rows; ++y) {
            this.level.push([]);
            for (let x = 0; x != this.cols; ++x) {
                let code = data[y][x];
                this.level[y].push(this.createCell(x, y, code));           
            }
        }
        console.log(this.data)

        //   var x = Phaser.Math.Between(0, 800);
        //  var y = Phaser.Math.Between(0, 600);
        //this.add.image(x, y, 'megaset', frames[i]);

        const logo = this.add.image(40, 150, 'BaseAtlas', "pacman_big/pacman-0");
        this.tweens.add({
            targets: logo,
            y: 45,
            duration: 2000,
            ease: "Power2",
            yoyo: true,
            loop: -1
        });
    }


    createCell(x, y, code) {
        let cell = null;

        if (Wall.nameFromKey(code) != null) {
            cell = new Wall(this, x, y, this.squareSize, code);
        } else {
            cell = new Space(this, x, y, this.squareSize);
        }


        console.log(code);
        return cell;
    }
}

export default Map;