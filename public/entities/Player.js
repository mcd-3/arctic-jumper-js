class Player extends Entity {
    constructor(canvasObj, x, y, spriteSheetName) {
        super(canvasObj, x, y);
        this.isGrounded = true;
        this.spriteSheetName = spriteSheetName;
        this.isAtStart = false;
        this.fadeX = 1000;
        this.originalX = this.x;
    }

    /**
     * Moves the player to the start position frame by frame
     */
    moveToStartPos() {
        if (!this.isAtStart) {
            this.fadeX -= 2;
            this.x = this.fadeX;
            this.draw();
        }
        this.isAtStart = (this.x <= this.originalX);
    }

    /**
     * Draws the player to screen
     */
    draw() {
        let img = new Image();
        img.src = `assets/images/${this.spriteSheetName}`;
        img.onload = this.onImageLoaded(img);
    }

    /**
     * Makes the player jump
     */
    jump() {

    }

    /**
     * Checks to see if the player is at the start position
     * 
     * @returns {boolean}
     */
    isAtStartPos() {
        return this.isAtStart;
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