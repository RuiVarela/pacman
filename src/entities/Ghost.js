import Entity from "./Entity";
import Character from "./Character";


const State = Object.freeze({
    None: "None",
    Starting: "Starting",
    Chase: "Chase",
    Killed: "Killed",
    ReturnStartPosition: "ReturnStartPosition"
});

class Ghost extends Character {

    constructor(scene, size, name, position) {
        super(scene, size, name + "/top_0", position);

        this.current_state = State.None;

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

    kill() {
        this.current_state = Ghost.State.Killed;
    }

    getNextAction(move, target) { // eslint-disable-line no-unused-vars
        let routes = {};
        routes[Character.Move.Up] = {};
        routes[Character.Move.Down] = {};
        routes[Character.Move.Left] = {};
        routes[Character.Move.Right] = {};
        //
        // compute routes
        //
        let min = 100000000;
        for (let key in routes) {
            routes[key]["info"] = this.checkMove(key);

            let x = target.cell_x - routes[key]["info"].target_cell_x;
            let y = target.cell_y - routes[key]["info"].target_cell_y;
            routes[key]["distance"] = Math.sqrt(x * x + y * y);

            // we cannot invert direction
            if (key === this.getInvertedMove(move)) {
                routes[key]["info"].stop = true;
            }

            if (!routes[key]["info"].stop && routes[key]["distance"] < min) {
                min = routes[key]["distance"];
            }
        }

        //
        // remove dead routes
        //
        for (let key in routes) {
            if (routes[key]["info"].stop || routes[key]["distance"] > min) {
                delete routes[key];
            }
        }

        //
        //up > left > down
        //
        if (Character.Move.Up in routes) {
            return routes[Character.Move.Up].info;
        } else if (Character.Move.Left in routes) {
            return routes[Character.Move.Left].info;
        } else if (Character.Move.Down in routes) {
            return routes[Character.Move.Down].info;
        } else if (Character.Move.Right in routes) {
            return routes[Character.Move.Right].info;
        }
    }

    doUpdate(time, delta) { // eslint-disable-line no-unused-vars
        let move = null;

        let state_changed = false;
        let pacman_position = this.scene.pacman.currentPosition();
        let target_position = pacman_position;

        //
        // just got killed
        //
        if (this.current_state == Ghost.State.Killed) {
            this.current_state = Ghost.State.ReturnStartPosition;
            state_changed = true;
        }



        //
        // Starting
        //
        if (this.current_state == Ghost.State.Starting) {

            move = Character.Move.Left;
            this.current_state = Ghost.State.Chase;
            state_changed = true;

        }
        //
        // Return to start
        //
        else if (this.current_state == Ghost.State.ReturnStartPosition) {

            let start_cell = Entity.computePositionFromArray(this.scene.ghost_house_start);
            let start_position = Entity.cellPosition(start_cell.x, start_cell.y, this.cell_size);

            let x = this.x - start_position.x;
            let y = this.y - start_position.y;
            let distance = Math.sqrt(x * x + y * y);

            if (distance < 1.0) {
                this.x = start_position.x;
                this.y = start_position.y;
                this.current_state = Ghost.State.Starting;
                move = this.move_info.move;
                state_changed = true;
            }
            else {
                target_position = { cell_x: start_cell.x, cell_y: start_cell.y };
                move = this.move_info.move;
            }

        }
        //
        // Chase
        //
        else if (this.current_state == Ghost.State.Chase) {

            move = this.move_info.move;
        }


        //
        // compute next move
        //
        let move_info = this.checkMove(move);
        if (move_info.on_change_point) {
            move_info = this.getNextAction(move, target_position);
        }


        //
        // setup the animation
        //
        move_info.angle = 0;
        if (state_changed || (this.move_info && (this.move_info.move != move_info.move))) {
            this.anims.stop();

            if (this.current_state == Ghost.State.ReturnStartPosition) {
                switch (move_info.move) {
                    case Character.Move.Up: this.anims.play(this.animation_death_up); break;
                    case Character.Move.Down: this.anims.play(this.animation_death_down); break;
                    case Character.Move.Left: this.anims.play(this.animation_death_left); break;
                    case Character.Move.Right: this.anims.play(this.animation_death_right); break;
                }
            } else {
                switch (move_info.move) {
                    case Character.Move.Up: this.anims.play(this.animation_up); break;
                    case Character.Move.Down: this.anims.play(this.animation_down); break;
                    case Character.Move.Left: this.anims.play(this.animation_left); break;
                    case Character.Move.Right: this.anims.play(this.animation_right); break;
                }
            }
        }

        this.applyMoveInfo(delta, move_info);
    }
}

Ghost.State = State;
export default Ghost;