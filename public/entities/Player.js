class Player extends Entity {
    constructor(canvasObj, x, y, spriteSheetName) {
        super(canvasObj, x, y);
        this.isGrounded = true;
        this.spriteSheetName = spriteSheetName;
        this.isAtStart = false;
        this.fadeX = 1000;
        this.originalX = this.x;

        // Health
        this.maxHitpoints = 3;
        this.hitpoints = this.maxHitpoints;
        this.invincibilityFrames = 75;
        this.currentInvincibility = 0;

        // Variables to control hitbox
        this.hitbox = new Hitbox(0,0,0,0);
        this.hitboxConfig = {
            Y_MARGIN: 58,
            X_MARGIN: 2,
            HEIGHT: 70,
            WIDTH: 68
        }

        // Variables to control jumping
        this.jumpConfig = {
            INIT_JUMP_FORCE: 8,
            INIT_JUMP_DIRECTION: 1,
            JUMP_FRAME_WAIT: 2,
            JUMP_ZERO_WAIT: 5,
            START_Y: this.y
        }
        this.jumpForce = this.jumpConfig.INIT_JUMP_FORCE; // subtract 1 until 0 each frame
        this.jumpDirection = this.jumpConfig.INIT_JUMP_DIRECTION; // 1 goes up, -1 goes down
        this.jumpWait = this.jumpConfig.JUMP_FRAME_WAIT; // wait time until we draw next frame
        this.jumpHeightWait = this.jumpConfig.JUMP_ZERO_WAIT; // waits at the top of a jump for x frames
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
     * Makes the player jump (in a non-grounded state)
     */
    jump() {
        if (this.isGrounded) {
            this.isGrounded = false;
        }
    }

    /**
     * Updates the player position
     */
    updatePos() {
        if (!this.isGrounded) { // see if player is able to jump

            if (this.y != this.jumpConfig.START_Y) { // buffer frames to make jump animate better
                this.jumpWait--;
            } else {
                this.jumpWait = 0;
            }

            if (this.jumpWait == 0) { // check if we land on a jump frame
                this.y -= (this.jumpForce * 8) * this.jumpDirection;

                if (this.jumpForce > 0) {
                    this.jumpForce--;
                }
    
                if (this.jumpForce == 0) {
                    if (this.jumpDirection < 1) {
                        this.isGrounded = true;
                    } else {
                        if (this.jumpHeightWait > 0) {
                            this.jumpHeightWait--;
                        } else {
                            this.jumpHeightWait = this.jumpConfig.JUMP_ZERO_WAIT;
                        }
                    }
                    if (this.jumpHeightWait <= 0) {
                        this.jumpDirection = (-this.jumpDirection);
                        this.jumpForce = this.jumpConfig.INIT_JUMP_FORCE;
                    }
                }
                this.jumpWait = this.jumpConfig.JUMP_FRAME_WAIT;
            }
        }
        this.hitbox.updatePos(
            this.y + this.hitboxConfig.Y_MARGIN,
            this.y + this.hitboxConfig.HEIGHT + this.hitboxConfig.Y_MARGIN,
            this.x + this.hitboxConfig.X_MARGIN,
            this.x + this.hitboxConfig.WIDTH + this.hitboxConfig.X_MARGIN
        );
        this.updateInvincibility();

        this.draw();
    }

    /**
     * Checks to see if the player is hurt
     */
    isHurt() {
        return (this.currentInvincibility > 0);
    }

    /**
     * Take damage
     */
    takeDamage() {
        this.hitpoints--;
        this.currentInvincibility = this.invincibilityFrames;
    }

    /**
     * Restore health to max
     */
    restoreAllHealth() {
        this.hitpoints = this.maxHitpoints;
    }

    /**
     * Updates the invincibility frames of the player
     */
    updateInvincibility() {
        if (this.isHurt()) {
            this.currentInvincibility--;
        }
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
     * Manually change the player's position
     * 
     * @param {int} x 
     * @param {int} y 
     */
    changePosition(x, y) {

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