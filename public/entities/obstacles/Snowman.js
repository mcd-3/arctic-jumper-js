class Snowman extends Obstacle {
    constructor(canvasObj, x, y, slideSpeed, hitbox) {
        super(canvasObj, x, y, slideSpeed, hitbox);
        this.spriteSheetName = 'snowman.png';
        this.spriteWidth = 72;
    }

    /**
     * Draws the snowman obstacle to screen
     */
    draw() {
        let img = new Image();
        img.src = `${this.imagePath}${this.spriteSheetName}`;
        img.onload = this.onImageLoaded(img);
    }

    /**
     * Internal function used to draw the player to screen
     * 
     * @param {Image} img 
     */
    onImageLoaded(img) {
        this.ctx.drawImage(img, this.x, this.y);
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