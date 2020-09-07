class Entity {
    constructor(canvas, x, y) {
        if (new.target == Entity) {
            throw new TypeError("Cannot instantiate an abstract class");
        }
        this.canvas = canvas;
        this.x = x;
        this.y = y;
    }
}