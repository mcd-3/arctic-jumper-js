class PlayerManager {

    #player;

    constructor(assetsFetcher) {
        this.#player = new Player(
            {canvas: document.getElementById("fgl2")},
            760,
            340,
            assetsFetcher.getPlayerImageLocation()
        );
    }

    /**
     * Update player position
     */
    updatePos() {
        this.#player.updatePos();
    }

    /**
     * Move player to start position
     */
    moveToStart() {
        this.#player.moveToStartPos();
    }

    /**
     * Make the player perform a jump
     */
    jump() {
        this.#player.jump();
    }

    /**
     * Draw the player to screen
     */
    draw() {
        this.#player.draw();
    }

    /**
     * Stops animating the player
     */
    stop() {
        this.#player.stop();
    }

    /**
     * Resume animating the player
     */
    resume() {
        this.#player.resume();
    }

    /**
     * Make the player take damage
     */
    takeDamage() {
        this.#player.takeDamage();
    }

    /**
     * Get the amount of HP the player has left
     * 
     * @returns {int} HP
     */
    getHP() {
        return this.#player.hitpoints;
    }

    /**
     * Restore the max amount of HP back to the player
     */
    restoreHP() {
        this.#player.restoreAllHealth();
    }

    /**
     * Resets the invincibility counter
     */
    resetInvincibility() {
        this.#player.resetInvincibility();
    }

    /**
     * Manually edit the player's location
     * 
     * @param {int} x 
     * @param {int} y 
     */
    changePos(x, y) {
        this.#player.changePosition(x, y);
    }

    /**
     * Check if the player has more than 0 HP
     * 
     * @returns {boolean}
     */
    isAlive() {
        return this.#player.hitpoints > 0;
    }

    /**
     * Check if the player passed an enemy
     * 
     * @param {Obstacle} enemy 
     * @returns {boolean}
     */
    isPassedEnemy(enemy) {
        return this.#player.hitbox.r < (
            enemy.hitbox.l + ((enemy.hitbox.r - enemy.hitbox.l) / 2)
        ) && !enemy.passedByPlayer;
    }

    /**
     * Check if the player is on the ground
     * 
     * @returns {boolean}
     */
    isGrounded() {
        return this.#player.isGrounded;
    }

    /**
     * Check if the player is at the starting position
     * 
     * @returns {boolean}
     */
    isAtStartPos() {
        return this.#player.isAtStartPos();
    }

    /**
     * Check if the player is overapping an enemy hitbox
     * 
     * @param {Obstacle} enemy 
     * @returns {boolean}
     */
    isOverlappingHitbox(enemy) {
        return this.#player.hitbox.isOverlapping(enemy.hitbox);
    }

    /**
     * Check if the player is hurt
     * 
     * @returns {boolean}
     */
    isHurt() {
        return this.#player.isHurt();
    }
}