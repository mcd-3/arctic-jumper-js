class Entity {
    constructor(canvasObj, x, y) {
        if (new.target == Entity) {
            throw new TypeError("Cannot instantiate an abstract class");
        }
        this.canvas = canvasObj.canvas;
        this.ctx = canvasObj.canvas.getContext("2d");
        this.x = x;
        this.y = y;
        this.imagePath = new PathStorageHelper().getImagesLocation();
    }
}