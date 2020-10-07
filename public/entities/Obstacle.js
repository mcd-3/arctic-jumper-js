class Obstacle extends Entity {
    constructor(canvasObj, x, y, slideSpeed, hitbox) {
        super(canvasObj, x, y);
        this.slideSpeed = slideSpeed;
        this.hitbox = hitbox;
    }

    /**
     * Slide the obstacle towards the player
     */
    slideTowardsPlayer() {
        this.x += this.slideSpeed;
    }

    /**
     * Checks to see if an obstacle is off screen
     */
    isOutOfBounds() {
        return (this.x > this.canvas.width);
    }
}