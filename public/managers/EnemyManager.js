class EnemyManager {

    #enemyBuffer;
    #framesUntilNewSpawn;
    #enemySpeed;
    #enemySpawnPointX;
    #enemySpawnPointY;

    constructor() {
        this.#enemyBuffer = [null, null, null];
        this.#enemyLimit = 3;
        this.#framesUntilNewSpawn = 35;
        this.#enemySpeed = 10;
        this.#enemySpawnPointX = -128;
        this.#enemySpawnPointY = 395;
    }

    /**
     * Gets the enemy array
     * 
     * @returns {Array}
     */
    getEnemyArray() {
        return this.#enemyBuffer;
    }

    /**
     * Gets an enemy pointed at a specific index in the enmy array
     * 
     * @param {int} i 
     * @returns {Array}
     */
    getEnemyAtIndex(i) {
        return this.#enemyBuffer[i];
    }

    /**
     * Stop all enemy movements
     */
    stopEnemies() {
        this.#enemyBuffer.forEach(enemy => {
            if (enemy != null) {
                enemy.stop();
            }
        });
    }

    /**
     * Resume moving enemies from a stopped state
     */
    resumeEnemies() {
        this.#enemyBuffer.forEach(enemy => {
            if (enemy != null) {
                enemy.resume();
            }
        });
    }

    /**
     * Draws all enemies
     */
    drawEnemies() {
        this.#enemyBuffer.forEach(enemy => {
            if (enemy != null) {
                enemy.draw();
            }
        });
    }

    /**
     * Despawns an enemy
     * 
     * @param {int} i
     */
     despawnEnemy(i) {
        this.#enemyBuffer[i] = null;
    }

    /**
     * Spawns an enemy in the enemy array
     */
    spawnEnemy() {
        --this.#framesUntilNewSpawn;
        if (this.#framesUntilNewSpawn <= 0) {
            let enemyTypes = 3;
            let frameTimeTypes = 4;
            let randomEnemy = Math.floor(Math.random() * Math.floor(enemyTypes)) + 1;
            let randomFrameTime = Math.floor(Math.random() * Math.floor(frameTimeTypes)) + 1;
    
            // Determine the enemy type;
            let enemy = null;
            switch(randomEnemy) {
                case 1:
                    let spawnPenguinY = this.#enemySpawnPointY;
                    enemy = new Penguin(
                        {canvas: game.spriteCanvas},
                        this.#enemySpawnPointX,
                        spawnPenguinY,
                        this.#enemySpeed
                    );
                    enemy.setHitbox(new Hitbox(
                        spawnPenguinY + 25,
                        spawnPenguinY + 70,
                        this.#enemySpawnPointX + 20,
                        this.#enemySpawnPointX + (enemy.getWidth() - 20)
                    ));
                    break;
                case 2:
                    let spawnRockY = this.#enemySpawnPointY + 10;
                    enemy = new Rock(
                        {canvas: game.spriteCanvas},
                        this.#enemySpawnPointX,
                        spawnRockY,
                        this.#enemySpeed
                    );
                    enemy.setHitbox(new Hitbox(
                        spawnRockY + 10,
                        spawnRockY + 62,
                        this.#enemySpawnPointX + 4,
                        this.#enemySpawnPointX + (enemy.getWidth() - 4)
                    ));
                    break;
                case 3:
                default:
                    let spawnSnowmanY = this.#enemySpawnPointY - 55;
                    enemy = new Snowman(
                        {canvas: game.spriteCanvas},
                        this.#enemySpawnPointX,
                        spawnSnowmanY,
                        this.#enemySpeed
                    );
                    enemy.setHitbox(new Hitbox(
                        spawnSnowmanY + 10,
                        spawnSnowmanY + 124,
                        this.#enemySpawnPointX + 12,
                        this.#enemySpawnPointX + (enemy.getWidth() - 12)
                    ));
                    break;
            }
    
            // Don't spawn an enemy if the buffer is full
            for (let i = 0; i < this.#enemyBuffer.length; i++) {
                if (this.#enemyBuffer[i] == null) {
                    this.#enemyBuffer[i] = enemy;
                    break;
                }
            }
    
            // Determine how many frame to wait until next spawn
            switch(randomFrameTime) {
                case 1:
                    this.#framesUntilNewSpawn = 135;
                    break;
                case 2:
                    this.#framesUntilNewSpawn = 175;
                    break;
                case 3:
                    this.#framesUntilNewSpawn = 200;
                    break;
                case 4:
                    this.#framesUntilNewSpawn = 80;
                    break;
                default:
                    this.#framesUntilNewSpawn = 135;
                    break;
            }
        }
    }

    /**
     * Clears the enemy array
     */
    clear() {
        this.#enemyBuffer = [null, null, null];
    }
}