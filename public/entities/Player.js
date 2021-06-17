class Player extends Entity {
    constructor(canvasObj, x, y, spriteSheetPath) {
        super(canvasObj, x, y);
        this.isGrounded = true;
        this.spriteSheetPath = spriteSheetPath;
        this.isAtStart = false;
        this.fadeX = 1000;
        this.originalX = this.x;
        this.isStopped = false;
        this.img = null;
        this.imgLoaded = false;

        // Health
        this.maxHitpoints = 3;
        this.hitpoints = this.maxHitpoints;
        this.invincibilityFrames = 128;
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
            JUMP_ZERO_WAIT: 3,
            START_Y: this.y
        }
        this.jumpForce = this.jumpConfig.INIT_JUMP_FORCE; // subtract 1 until 0 each frame
        this.jumpDirection = this.jumpConfig.INIT_JUMP_DIRECTION; // 1 goes up, -1 goes down
        this.jumpWait = this.jumpConfig.JUMP_FRAME_WAIT; // wait time until we draw next frame
        this.jumpHeightWait = this.jumpConfig.JUMP_ZERO_WAIT; // waits at the top of a jump for x frames

        // Sprite upper left coordinates
        this.spriteCoordinates = {
            frame1: [0, 0],
            frame2: [144, 0],
            frame3: [0, 0],
            frame4: [72, 0],
            frame5: [0, 256],
            frame6: [144, 256],
            frame7: [0, 256],
            frame8: [72, 256],
            jumpUp: [0, 128],
            jumpDown: [72, 128],
            jumpUpHit: [0, 384],
            jumpDownHit: [72, 384]
        }
        this.spriteWidth = 72;
        this.spriteHeight = 128;
        this.maxWaitFrames = 18;
        this.waitFrames = this.maxWaitFrames;
        this.frameSpeed = 1;
        this.currentFrame = 1;

        this.initPlayerImage();
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
        if (this.imgLoaded) {
            if (this.isGrounded) {
                let frameStr = '';
                this.currentInvincibility == 0
                    ? frameStr = `frame${this.currentFrame}`
                    : frameStr = `frame${this.currentFrame + 4}`;
                engine.gfxController.drawSprite(
                    this.img,
                    this.spriteCoordinates[frameStr][0],
                    this.spriteCoordinates[frameStr][1],
                    72,
                    128,
                    this.x,
                    this.y,
                    this.spriteWidth,
                    this.spriteHeight
                );
    
                if (!this.isStopped) {
                    this.waitFrames--;
                    if (this.waitFrames < 1) {
                        this.currentFrame++;
                        if (this.currentFrame > 4) {
                            this.currentFrame = 1;
                        }
                        this.waitFrames = this.maxWaitFrames;
                    }
                }
            } else {
                let jumpStr = (this.jumpDirection > 0)
                    ? "jumpUp"
                    : "jumpDown";
                if (this.currentInvincibility != 0) {
                    jumpStr += "Hit";
                } 
                engine.gfxController.drawSprite(
                    this.img,
                    this.spriteCoordinates[jumpStr][0],
                    this.spriteCoordinates[jumpStr][1],
                    72,
                    128,
                    this.x,
                    this.y,
                    this.spriteWidth,
                    this.spriteHeight);
            }
        }
    }

    /**
     * Load the sprite sheet into memory
     */
    initPlayerImage() {
        this.img = new Image();
        this.img.src = this.spriteSheetPath;
        this.img.onload = this.onImageLoaded();
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
                if (this.jumpDirection > 0) {
                    this.y -= (this.jumpForce * 8) * this.jumpDirection;
                } else {
                    this.y += (this.jumpConfig.INIT_JUMP_FORCE * 9) - (this.jumpForce * 8);
                }

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
     * Flag the image as loaded into memory
     */
    onImageLoaded() {
        this.imgLoaded = true;
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
     * Manually changes player position
     * 
     * @param {int} x 
     * @param {int} y 
     */
    changePosition(x, y) {

    }

    /**
     * Sets the current invincibility frames to 0
     */
    resetInvincibility() {
        this.currentInvincibility = 0;
    }

    /**
     * Stops movement
     */
    stop() {
        this.isStopped = true;
    }

    /**
     * Resumes movement
     */
    resume() {
        this.isStopped = false;
    }
}