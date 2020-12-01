class Obstacle extends Entity {
    constructor(canvasObj, x, y, slideSpeed, hitbox = null) {
        super(canvasObj, x, y);
        this.slideSpeed = slideSpeed;
        this.hitbox = hitbox;
        this.passedByPlayer = false;
    }

    /**
     * Slide the obstacle towards the player
     */
    slideTowardsPlayer() {
        this.x += this.slideSpeed;
        if (this.hitbox != null) {
            this.hitbox.updatePos(this.hitbox.u, this.hitbox.d, this.hitbox.l + this.slideSpeed, this.hitbox.r + this.slideSpeed);
        }
    }

    /**
     * Checks to see if an obstacle is off screen
     */
    isOutOfBounds() {
        return (this.x > this.canvas.width);
    }

    /**
     * Change the hitbox, if needed
     * 
     * @param {Hitbox} hitbox
     */
    setHitbox(hitbox) {
        this.hitbox = hitbox
    }
}