class Background extends Entity {
    constructor(canvas, x, y, dx, dy, speed, imgW, imgH, image) {
        super(canvas, x, y);
        this.dx = dx;
        this.dy = dy;
        this.speed = speed;
        this.imgW = imgW;
        this.imgH = imgH;
        this.image = image;
    }

    draw() {

    }
}