import Character from "./Character";


class Ghost extends Character {

    constructor(scene, size, name, position) {
        super(scene, size, name + "/top_0", position);

        this.animation_up = this.createGhostAnimation(name, Character.Move.Up);
        this.animation_down = this.createGhostAnimation(name, Character.Move.Down);
        this.animation_left = this.createGhostAnimation(name, Character.Move.Left);
        this.animation_right = this.createGhostAnimation(name, Character.Move.Right);



    
        this.anims.play(this.animation_left);
        //this.anims.pause(this.animation.frames[2]);
        
    }

    createGhostAnimation(name, move) {
        let move_name;

        if (move === Character.Move.Up)
            move_name = "top";
        else if (move === Character.Move.Down)
            move_name = "bottom";
        else if (move === Character.Move.Left)
            move_name = "left";
        else if (move === Character.Move.Right)
            move_name = "right";


        let key = name + "_move_" + move;
        key = key.toLowerCase();

        console.log(key);

        return this.scene.anims.create({
            key: key,
            frames: [
                { key: "BaseAtlas", frame: name + "/" + move_name + "_0" },
                { key: "BaseAtlas", frame: name + "/" + move_name + "_1" }
            ],
            frameRate: 10,
            repeat: -1
        });
    }


}

export default Ghost;