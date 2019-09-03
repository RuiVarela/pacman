import Entity from "./Entity";

class Wall extends Entity {

    static nameFromKey(code) {
        if (code === "q") {
            return "map/outer_top_left";
        } else if (code === "w") {
            return "map/outer_top";
        } else if (code === "e") {
            return "map/outer_top_right";
        } else if (code === "a") {
            return "map/outer_left";
        } else if (code === "d") {
            return "map/outer_right";
        } else if (code === "z") {
            return "map/outer_bottom_left";
        } else if (code === "c") {
            return "map/outer_bottom_right";
        } else if (code === "x") {
            return "map/outer_bottom";
        }

        else if (code === "r") {
            return "map/inner_top_left";
        } else if (code === "t") {
            return "map/inner_top";
        } else if (code === "y") {
            return "map/inner_top_right";
        } else if (code === "h") {
            return "map/inner_right";
        } else if (code === "f") {
            return "map/inner_left";
        } else if (code === "v") {
            return "map/inner_bottom_left";
        } else if (code === "n") {
            return "map/inner_bottom_right";
        } else if (code === "b") {
            return "map/inner_bottom";
        }

        else if (code === "u") {
            return "map/outer_junction_top_left";
        } else if (code === "i") {
            return "map/outer_junction_top_right";
        } else if (code === "j") {
            return "map/outer_junction_left_top";
        } else if (code === "k") {
            return "map/outer_junction_left_bottom";
        } else if (code === "m") {
            return "map/outer_junction_right_top";
        } else if (code === ",") {
            return "map/outer_junction_right_bottom";
        } 

        else if (code === "o") {
            return "map/inner_junction_top_left";
        } else if (code === "p") {
            return "map/inner_junction_top_right";
        } else if (code === "l") {
            return "map/inner_junction_bottom_left";
        } else if (code === "ç") {
            return "map/inner_junction_bottom_right";
        } 

        else if (code === "º") {
            return "map/square_top_left";
        } else if (code === "ª") {
            return "map/square_top_right";
        } else if (code === "´") {
            return "map/square_bottom_left";
        } else if (code === "`") {
            return "map/square_bottom_right";
        } else if (code === "~") {
            return "map/square_open_left";
        } else if (code === "^") {
            return "map/square_open_right";
        } else if (code === "|") {
            return "map/square_opening";
        }

        return null;
    }

    constructor(scene, x, y, size, key) {
        super(scene, x, y, size, Wall.nameFromKey(key));
    }
}

export default Wall;