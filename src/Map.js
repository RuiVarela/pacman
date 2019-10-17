import App from "./Application";

import Wall from "./entities/Wall";
import Space from "./entities/Space";
import Dot from "./entities/Dot";
import Phaser from "phaser";
import Energizer from "./entities/Energizer";

import Pacman from "./entities/Pacman";
import Blinky from "./entities/Blinky";
import Pinky from "./entities/Pinky";
import Inky from "./entities/Inky";
import Clyde from "./entities/Clyde";
import Character from "./entities/Character";

import BaseAtlasImage from "./assets/base_atlas.png";
import BaseAtlasJson from "./assets/base_atlas.json";

import MapJson from "./assets/map00.json";

import ChompSound from "./assets/sounds/chomp.wav";



class Map extends Phaser.Scene {

    constructor(config) {
        super(config);
        console.log("Map constructor");

        this.level = [];
        this.squareSize = App.squareSize;
    }

    preload() {
        console.log("Map preload");
        this.load.atlas("BaseAtlas", BaseAtlasImage, BaseAtlasJson);
        this.load.audio("ChompSound", ChompSound);
    }

    create() {
        console.log("Map create");

        this.cursors = this.input.keyboard.createCursorKeys();

        // if (false) {
        //     let atlas = this.textures.get("BaseAtlas");
        //     let frames = atlas.getFrameNames();
        //     for (var i = 0; i < frames.length; i++) {
        //         console.log(frames[i]);
        //     }
        // }

        //   var x = Phaser.Math.Between(0, 800);
        //  var y = Phaser.Math.Between(0, 600);
        //this.add.image(x, y, 'megaset', frames[i]);

        let json = MapJson;
        let data = json.data;
        this.rows = data.length;
        this.cols = data[0].length;

        for (let y = 0; y != this.rows; ++y) {
            this.level.push([]);
            for (let x = 0; x != this.cols; ++x) {
                let code = data[y][x];
                this.level[y].push(this.createCell(x, y, code));
            }
        }

        this.ghost_house_start = json.ghost_house_start.slice();
        this.blinky_start = json.ghost_house_start.slice();

        this.pinky_start = json.ghost_house_start.slice();
        this.pinky_start[1] += 3;
        this.pinky_start[3] += 3;

        this.inky_start = json.ghost_house_start.slice();
        this.inky_start[0] -= 2;
        this.inky_start[1] += 3;
        this.inky_start[2] -= 2;
        this.inky_start[3] += 3;

        this.clyde_start = json.ghost_house_start.slice();
        this.clyde_start[0] += 2;
        this.clyde_start[1] += 3;
        this.clyde_start[2] += 2;
        this.clyde_start[3] += 3;

        this.pacman = new Pacman(this, this.squareSize, json.pacman_position);
        this.blinky = new Blinky(this, this.squareSize, this.blinky_start);
        this.pinky = new Pinky(this, this.squareSize, this.pinky_start );
        this.inky = new Inky(this, this.squareSize, this.inky_start);
        this.clyde = new Clyde(this, this.squareSize, this.clyde_start);
    }

    getCell(x, y) {
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
            return this.level[y][x];
        }
        return null;
    }

    createCell(x, y, code) {
        let cell = null;

        if (Wall.nameFromKey(code) != null) {
            cell = new Wall(this, x, y, this.squareSize, code);
        } else if (Dot.nameFromKey(code) != null) {
            cell = new Dot(this, x, y, this.squareSize, code);
        } else if (Energizer.nameFromKey(code) != null) {
            cell = new Energizer(this, x, y, this.squareSize, code);
        } else {
            cell = new Space(this, x, y, this.squareSize);
        }
        return cell;
    }

    setSpaceCell(x, y) {
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {

            if (this.level[y][x]) {
                this.level[y][x].destroy();
            }
            
            this.level[y][x] = new Space(this, x, y, this.squareSize);
        }

    }

    update(time, delta) {
        if (this.cursors.left.isDown)
            this.pacman.setNextMove(Character.Move.Left);
        else if (this.cursors.right.isDown)
            this.pacman.setNextMove(Character.Move.Right);
        else if (this.cursors.up.isDown)
            this.pacman.setNextMove(Character.Move.Up);
        else if (this.cursors.down.isDown)
            this.pacman.setNextMove(Character.Move.Down);

        this.pacman.doUpdate(time, delta);
        this.blinky.doUpdate(time, delta);
        this.pinky.doUpdate(time, delta);
        this.inky.doUpdate(time, delta);
        this.clyde.doUpdate(time, delta);
    }

}

export default Map;