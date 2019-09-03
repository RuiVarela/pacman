import Entity from "./Entity";

class Energizer extends Entity {

    static nameFromKey(code) {
        if (code === ":") {
            return "map/power";
        } 
        return null;
    }

    constructor(scene, x, y, size, key) {
        super(scene, x, y, size, Energizer.nameFromKey(key));

        this.alpha = 1.0;

        scene.tweens.add({
            targets: this,
            alpha: 0.0,
            duration: 100,
            ease: "linear",
            yoyo: true,
            delay: 100,
            loop: -1
        });


    }
}

export default Energizer;