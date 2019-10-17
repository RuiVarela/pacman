import Character from "./Character";

const State = Object.freeze({
    Starting: "Starting",
    Chase: "Chase",
    ReturnStartPosition: "ReturnStartPosition"
});


class Ghost extends Character {

    constructor(scene, size, name, position) {
        super(scene, size, name + "/top_0", position);

        this.current_state = State.Starting;

        this.animation_up = this.createGhostAnimation(name, Character.Move.Up);
        this.animation_down = this.createGhostAnimation(name, Character.Move.Down);
        this.animation_left = this.createGhostAnimation(name, Character.Move.Left);
        this.animation_right = this.createGhostAnimation(name, Character.Move.Right);

        this.animation_death_up = this.createGhostDeathAnimation(name, Character.Move.Up);
        this.animation_death_down = this.createGhostDeathAnimation(name, Character.Move.Down);
        this.animation_death_left = this.createGhostDeathAnimation(name, Character.Move.Left);
        this.animation_death_right = this.createGhostDeathAnimation(name, Character.Move.Right);

        this.anims.play(this.animation_left);
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

        //console.log(key);

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

    createGhostDeathAnimation(name, move) {
        let move_name;

        if (move === Character.Move.Up)
            move_name = "top";
        else if (move === Character.Move.Down)
            move_name = "bottom";
        else if (move === Character.Move.Left)
            move_name = "left";
        else if (move === Character.Move.Right)
            move_name = "right";


        let key = name + "_ghost_killed_" + move;
        key = key.toLowerCase();

        //console.log(key);

        return this.scene.anims.create({
            key: key,
            frames: [
                { key: "BaseAtlas", frame: "ghost_killed/" + move_name },
                { key: "BaseAtlas", frame: "ghost_killed/" + move_name }
            ],
            frameRate: 10,
            repeat: -1
        });
    }

}

Ghost.State = State;
export default Ghost;