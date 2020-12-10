class Snowman extends Obstacle {
    constructor(canvasObj, x, y, slideSpeed, hitbox) {
        super(canvasObj, x, y, slideSpeed, hitbox);
        this.spriteWidth = 72;
        this.img = null;
        this.imgloaded = false;

        this.initImage();
    }

    /**
     * Draws the snowman obstacle to screen
     */
    draw() {
        if (this.imgloaded) {
            this.ctx.drawImage(this.img, this.x, this.y);
        }
    }

    /**
     * Flags the sprite as loaded into memory
     */
    onImageLoaded() {
        this.imgloaded = true;
    }

    /**
     * Loads the sprite into memory
     */
    initImage() {
        this.img = new Image();
        this.img.src = this.assetFetcher.getSnowmanImageLocation();;
        this.img.onload = this.onImageLoaded();
    }

    /**
     * Returns the width of the sprite
     * 
     * @returns {int}
     */
    getWidth() {
        return this.spriteWidth;
    }
}