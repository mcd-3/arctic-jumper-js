class Entity {
    constructor(x, y) {
        if (new.target == Entity) {
            throw new TypeError("Cannot instantiate an abstract class");
        }
        this.x = x;
        this.y = y;
    }

    draw(canvas2DContext) {

    }
}