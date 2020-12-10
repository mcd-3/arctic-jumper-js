class Penguin extends Obstacle {
    constructor(canvasObj, x, y, slideSpeed, hitbox = null) {
        super(canvasObj, x, y, slideSpeed, hitbox);
        this.spriteWidth = 164;
        this.spriteHeight = 72;
        this.maxWaitFrames = 18;
        this.waitFrames = this.maxWaitFrames;
        this.frameSpeed = 1;
        this.isFrame1 = true;
        this.img = null;
        this.imgloaded = false;

        this.initImage();
    }

    /**
     * Draws the penguin obstacle to screen
     */
    draw() {
        if (this.imgloaded) {
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
                this.ctx.drawImage(this.img, 0, 0, 164, 72, this.x, this.y, this.spriteWidth, this.spriteHeight);
            } else {
                this.ctx.drawImage(this.img, 164, 0, 164, 72, this.x, this.y, this.spriteWidth, this.spriteHeight);
            }
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
        this.img.src = this.assetFetcher.getPenguinImageLocation();
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