class Penguin extends Obstacle {
    constructor(canvasObj, x, y, slideSpeed, hitbox = null) {
        super(canvasObj, x, y, slideSpeed, hitbox);
        this.spriteWidth = 164;
        this.spriteHeight = 72;
        this.maxWaitFrames = 18;
        this.waitFrames = this.maxWaitFrames;
        this.frameSpeed = 1;
        this.isFrame1 = true;
    }

    /**
     * Draws the penguin obstacle to screen
     */
    draw() {
        let img = new Image();
        img.src = this.assetFetcher.getPenguinImageLocation();
        img.onload = this.onImageLoaded(img);
    }

    /**
     * Internal function used to draw the player to screen
     * 
     * @param {Image} img 
     */
    onImageLoaded(img) {

        if (this.waitFrames > 0) {
            this.waitFrames -= this.frameSpeed;
        } else {
            this.waitFrames = this.maxWaitFrames;

            // Dont animate if the animation is supposed to be stopped
            if (!this.isStopped) {
                this.isFrame1 = !this.isFrame1;
            }
        }

        if (this.isFrame1) {
            this.ctx.drawImage(img, 0, 0, 164, 72, this.x, this.y, this.spriteWidth, this.spriteHeight);
        } else {
            this.ctx.drawImage(img, 164, 0, 164, 72, this.x, this.y, this.spriteWidth, this.spriteHeight);
        }
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