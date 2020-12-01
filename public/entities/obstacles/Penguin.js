class Penguin extends Obstacle {
    constructor(canvasObj, x, y, slideSpeed, hitbox = null) {
        super(canvasObj, x, y, slideSpeed, hitbox);
        this.spriteSheetName = 'penguin.png';
        this.spriteWidth = 164;
    }

    /**
     * Draws the penguin obstacle to screen
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