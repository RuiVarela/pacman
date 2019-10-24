import Phaser from "phaser";

import App from "./Application";
import { Wall, Space, Dot, Energizer}  from "./entities/Static";


import Pacman from "./entities/Pacman";
import Character from "./entities/Character";
import { Ghost, Blinky, Pinky, Inky, Clyde } from "./entities/Ghost";

import BaseAtlasImage from "./assets/base_atlas.png";
import BaseAtlasJson from "./assets/base_atlas.json";

import MapJson from "./assets/map00.json";

import FontPng from "./assets/atari-classic.png";
import FontXml from "./assets/atari-classic.xml";

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
        this.load.bitmapFont("arcade", FontPng, FontXml);
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

        this.score = 0;

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
        let blinky_start = json.ghost_house_start.slice();

        let pinky_start = json.ghost_house_start.slice();
        pinky_start[1] += 3;
        pinky_start[3] += 3 + 1;

        let inky_start = json.ghost_house_start.slice();
        inky_start[0] -= 2;
        inky_start[1] += 3 - 1;
        inky_start[2] -= 2;
        inky_start[3] += 3;

        let clyde_start = json.ghost_house_start.slice();
        clyde_start[0] += 2;
        clyde_start[1] += 3 - 1;
        clyde_start[2] += 2;
        clyde_start[3] += 3;

        this.pacman = new Pacman(this, this.squareSize, json.pacman_position);
        this.blinky = new Blinky(this, this.squareSize, blinky_start);
        this.pinky = new Pinky(this, this.squareSize, pinky_start);
        this.inky = new Inky(this, this.squareSize, inky_start);
        this.clyde = new Clyde(this, this.squareSize, clyde_start);

        this.score_text = this.add.bitmapText(0, this.squareSize, "arcade", "").setFontSize(this.squareSize);

        this.add.bitmapText(this.squareSize * 9, 0, "arcade", "HIGH SCORE").setFontSize(this.squareSize);
        this.add.bitmapText(this.squareSize * 11, this.squareSize, "arcade", "111084").setFontSize(this.squareSize);
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

    incrementScore(amount) {
        this.score += amount;
    }

    checkCollision(pacman_position, ghost) { // eslint-disable-line no-unused-vars
        if (ghost.move_info &&
            ghost.current_state == Ghost.State.Chase &&
            pacman_position.cell_x == ghost.move_info.cell_x &&
            pacman_position.cell_y == ghost.move_info.cell_y) {

            this.incrementScore(1000);
            ghost.kill();
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

        // check collisions
        let pacman_position = this.pacman.currentPosition();
        this.checkCollision(pacman_position, this.blinky);
        this.checkCollision(pacman_position, this.pinky);
        this.checkCollision(pacman_position, this.inky);
        this.checkCollision(pacman_position, this.clyde);

        this.pacman.doUpdate(time, delta);
        this.blinky.doUpdate(time, delta);
        this.pinky.doUpdate(time, delta);
        this.inky.doUpdate(time, delta);
        this.clyde.doUpdate(time, delta);


        //
        // Score text
        //
        let score_string = this.score.toString();
        while (score_string.length < 7) 
            score_string = " " + score_string;

        this.score_text.setText(score_string);
    }

}

export default Map;