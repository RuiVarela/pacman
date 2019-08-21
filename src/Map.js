import App from "./Application";
import Phaser from "phaser";

import BaseAtlasImage from "./assets/base_atlas.png";
import BaseAtlasJson from "./assets/base_atlas.json";

class Map extends Phaser.Scene {
    constructor(config) {
        super(config);
        console.log("Map constructor")
    }

    preload() {
        console.log("Map preload");
        this.load.atlas('BaseAtlas', BaseAtlasImage, BaseAtlasJson);
        console.log(BaseAtlasJson)
    }

    create() {
        console.log("Map create");

        if (true) {
            let atlas = this.textures.get('BaseAtlas');
            let frames = atlas.getFrameNames();
            for (var i = 0; i < frames.length; i++) {
                console.log(frames[i]);
            }
        }

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
}

export default Map;