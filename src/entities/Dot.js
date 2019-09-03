import Entity from "./Entity";

class Dot extends Entity {
    
    static nameFromKey(code) {
        if (code === ".") {
            return "map/dot";
        } 
        return null;
    }

    constructor(scene, x, y, size, key) {
        super(scene, x, y, size, Dot.nameFromKey(key));
    }
}

export default Dot;