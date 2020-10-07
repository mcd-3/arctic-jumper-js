class Penguin extends Obstacle {
    constructor(canvasObj, x, y, slideSpeed, hitbox) {
        super(canvasObj, x, y, slideSpeed, hitbox);
        this.spriteSheetName = 'penguin.png'
    }

    /**
     * Draws the penguin obstacle to screen
     */
    draw() {
        let img = new Image();
        img.src = `assets/images/${this.spriteSheetName}`;
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
}