import App from "./Application";
import Phaser from "phaser";

import BaseAtlasImage from "./assets/base_atlas.png";
import BaseAtlasJson from "./assets/base_atlas.json";

import Map00Json from "./assets/map00.json";

var EntityKind = {
    None: 0,
    Wall: 1
};

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
        let cell = {
            pos: { 
                x : this.squareSize * x + this.squareSize * 0.5, 
                y : this.squareSize * y + this.squareSize * 0.5 
            },
            kind: EntityKind.None,
            sprite: null
        };


        //
        // outer wall
        //
        if (code === 'q') {
            cell.kind = EntityKind.Wall;
            cell.sprite = this.add.image(cell.pos.x, cell.pos.y, 'BaseAtlas', "map/outer_top_left");
        } else if (code === 'w') {
            cell.kind = EntityKind.Wall;
            cell.sprite = this.add.image(cell.pos.x, cell.pos.y, 'BaseAtlas', "map/outer_top");
        } else if (code === 'e') {
            cell.kind = EntityKind.Wall;
            cell.sprite = this.add.image(cell.pos.x, cell.pos.y, 'BaseAtlas', "map/outer_top_right");
        } else if (code === 'a') {
            cell.kind = EntityKind.Wall;
            cell.sprite = this.add.image(cell.pos.x, cell.pos.y, 'BaseAtlas', "map/outer_left");
        } else if (code === 'd') {
            cell.kind = EntityKind.Wall;
            cell.sprite = this.add.image(cell.pos.x, cell.pos.y, 'BaseAtlas', "map/outer_right");
        } else if (code === 'z') {
            cell.kind = EntityKind.Wall;
            cell.sprite = this.add.image(cell.pos.x, cell.pos.y, 'BaseAtlas', "map/outer_bottom_left");
        } else if (code === 'c') {
            cell.kind = EntityKind.Wall;
            cell.sprite = this.add.image(cell.pos.x, cell.pos.y, 'BaseAtlas', "map/outer_bottom_right");
        } else if (code === 'x') {
            cell.kind = EntityKind.Wall;
            cell.sprite = this.add.image(cell.pos.x, cell.pos.y, 'BaseAtlas', "map/outer_bottom");
        }




        if (cell.sprite) {
            cell.sprite.displayWidth = this.squareSize;
            cell.sprite.displayHeight = this.squareSize;
        }

        console.log(code);
        //this.data.push([]); 
        return cell;
    }
}

export default Map;