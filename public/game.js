/**
 * game.js
 * 
 * Contains all game functionality and logic
 */

// Asset directories
const assetsDir = "./assets/";
const audioDir = `${assetsDir}audio/`;
const imagesDir = `${assetsDir}images/`;

// Text strings
const authorStr = "Made by: Matthew C-D";
const startStr = "-- Press Space to Start --";
const healthStr = "Health: ";
const scoreStr = "Score: ";
const highScoreStr = "High Score: ";
const gameOverStr = "Game Over!";
const resumeStr = "-- Press Space to Play Again --";
const newHighScoreStr = "New High Score!";

// HTML elements
const spaceBarKeyCode = "Space";

// Program flags
let bootCompleteFlag = false;

// This is the game object
let game;

// Event for pressing space
document.addEventListener('keydown', (e) => {
    if (e.code == spaceBarKeyCode) {
        if (game.modes.menu) {
            if (game.titleDoneFlag) { // Play music, get rid of title card
                game.titleCard.setCoordinates(330, 60, 330, -138, true);
                game.gameStartingFlag = true;
                let playSounds = new Promise(resolve => {
                    game.playSFX(`${audioDir}magicIdea01.mp3`, 1);
                    resolve(true);
                }).then(value => {
                    game.stopTrack();
                    game.playTrack(`${audioDir}steviaSphere_PolarBears.mp3`, true, 0.5);
                });
            }
        } else if (game.modes.play) {
            game.player.jump();
        } else if (game.modes.death) {
            game.restart();
        }
    }
});

/**
 * The base game object.
 * It contains all game logic, variables, audio, text, and sequences.
 */
class Game {

    /**
     * Initializes the game
     * 
     * @param {Canvas} canvas Boot canvas 
     * @param {CanvasRenderingContext2D} ctx Boot canvas context 
     */
    constructor(bootCanvas, spriteCanvas) {
        let scaler = new CanvasDPIHelper();
        this.bootCanvas = bootCanvas;
        this.bootCanvasCtx = this.bootCanvas.getContext("2d");
        this.spriteCanvas = spriteCanvas;
        this.spriteCanvasCtx = scaler.scale(this.spriteCanvas);//this.spriteCanvas.getContext("2d");

        // Emulate a dark intro screen seen in most games
        this.bootCanvasCtx.fillStyle = 'black';
        this.bootCanvasCtx.fillRect(0, 0, this.bootCanvas.width, this.bootCanvas.height);

        // game objects
        this.titleCard = null;
        this.bgl1 = null;
        this.bgl2 = null;
        this.fgl1 = null;
        this.fgl2 = null;
        this.dl = null;
        this.hud1 = null;
        this.hud2 = null;
        this.hud3 = null;
        this.hud4 = null;
        this.player = null;

        // game variables
        this.bootTime = 7500;
        this.bgl1Speed = 50;
        this.bgl2Speed = 20;
        this.fgl1Speed = 3;
        this.modes = {
            'boot': false,
            'menu': false,
            'play': false,
            'death': false
        };
        this.score = 0;

        // flags
        this.titleDoneFlag = false;
        this.gameStartingFlag = false;
        this.newHighScoreFlag = false;

        // enemy variables
        this.enemyBuffer = [];
        this.enemyLimit = 3;
        this.framesUntilNewSpawn = 35;
        this.enemySpeed = 8;
        this.enemySpawnPoint = -128;

        // game audio
        this.playingTrack = null;

        // game storage
        this.storage = new ScoreStorageHelper();

        // game strings
        this.madeByText = new UIText({canvas: this.spriteCanvas}, 20, (540-30), authorStr, 30, 1.45);
        this.startText = new UIText({canvas: this.spriteCanvas}, 334, 210, startStr, 24, 1.15);
        this.healthText = null;
        this.scoreText = null;
        this.gameOverText = null;
        this.highScoreText = null;
    }

    /**
     * Set the game mode
     * 
     * @param {string} mode 
     */
    setMode(mode) {
        Object.keys(this.modes).forEach(value => this.modes[value] = false);
        if (this.modes[mode] != undefined) {
            this.modes[mode] = true;
        }
    }

    /**
     * Runs when the game is booted up.
     * Shows the developer logo, plays a sound, then fades into the game.
     * 
     * NOTE: This should only run ONCE at startup
     */
    boot() {
        let bootLogo = new Image();
        bootLogo.src = `${imagesDir}boot.png`;

        let bgl1 = document.getElementById("bgl1");
        let bgl1Ctx = bgl1.getContext("2d");

        bootLogo.onload = () => {
            let bootSfx = new Audio(`${audioDir}logo_short.mp3`);
            bootSfx.play();
            bgl1Ctx.globalAlpha = 0;
            
            // Fade the logo in
            function fadeIn() {
                if (!bootCompleteFlag) {
                    bgl1Ctx.globalAlpha += 0.02;
                    bgl1Ctx.clearRect(0, 0, bgl1.width, bgl1.height);
                    bgl1Ctx.drawImage(bootLogo, 0, 0);
        
                    if (bgl1Ctx.globalAlpha < 1.0) {
                        requestAnimationFrame(fadeIn);    
                    }
                }
            }

            // Fade the logo out
            function fadeOut() {
                if (!bootCompleteFlag) {
                    bgl1Ctx.globalAlpha -= 0.05;
                    bgl1Ctx.clearRect(0, 0, bgl1.width, bgl1.height);
                    bgl1Ctx.drawImage(bootLogo, 0, 0);
        
                    if (bgl1Ctx.globalAlpha > 0) {
                        requestAnimationFrame(fadeOut);    
                    }
                }
            }

            // Fade in, then fade out logo
            requestAnimationFrame(fadeIn);
            setTimeout(() => {
                requestAnimationFrame(fadeOut);
            }, 5500);    
        }
    }

    /**
     * Wait for the game to be finished loading
     * 
     * @return {Promise}
     */
    awaitBootFinish() {
        return this.sleep(this.bootTime);
    }

    /**
     * Play a music track. Not to be used for SFX
     * 
     * @param {string} track 
     * @param {boolean} isLoop 
     * @param {float} volume 
     * @returns {Audio}
     */
    playTrack(track, isLoop, volume) {
        if (this.playingTrack != null) {
            this.stopTrack();
        }
        this.playingTrack = new Audio(track);
        this.playingTrack.loop = isLoop;
        this.playingTrack.volume = volume;
        this.playingTrack.play();
        return this.playingTrack;
    }

    /**
     * Stops a music track if it is playing
     */
    stopTrack() {
        if (this.playingTrack != null) {
            this.playingTrack.pause();
            this.playingTrack.currentTime = 0;
            this.playingTrack = null;
        }
    }

    /**
     * Plays a sound effect. Not to be used for music tracks
     * 
     * @param {string} sfx 
     * @param {float} volume 
     * @returns {Audio}
     */
    playSFX(sfx, volume) {
        let gameSfx = new Audio(sfx);
        gameSfx.volume = volume;
        gameSfx.play();
        return gameSfx;
    }

    /**
     * Starts main menu mode
     */
    menu() {
            // Draw the title card moving downwards or stationary if it isn't finished yet
            this.titleCard.draw();
            this.titleDoneFlag = this.titleCard.isDoneDrawing;
            this.madeByText.draw();

            if (this.titleDoneFlag) {
                this.startText.draw();
            }

            // Start drawing in the player and moving card off-screen
            if (this.gameStartingFlag) {
                this.player.moveToStartPos();
                if (this.titleCard.isDoneDrawing) {
                    this.setMode("play");
                }
            }
    }

    /**
     * Plays the game in play mode
     */
    play() {
        if (this.player.isAtStartPos()) {

            if (this.player.hitpoints < 1) {
                this.hud2.changeColor("#ff0000");
            }

            // Draw the HUD first
            this.hud1.drawText();
            this.hud2.drawText();
            this.hud4.drawText();

            this.framesUntilNewSpawn--;

            for (let i = 0; i < this.enemyBuffer.length; i++) {
                this.enemyBuffer[i].slideTowardsPlayer();

                if (this.enemyBuffer[i].isOutOfBounds()) {
                    this.despawnEnemy(i);
                } else {
                    this.enemyBuffer[i].draw();
                    this.enemyBuffer[i].hitbox.debugDrawHitbox(this.spriteCanvasCtx);
                }
            }

            if (this.framesUntilNewSpawn <= 0) {
                this.spawnEnemy();
            }

            this.player.updatePos();
            this.player.hitbox.debugDrawHitbox(this.spriteCanvasCtx);

            this.enemyBuffer.forEach(enemy => {

                // Check if hitboxes overlap
                if (this.player.hitbox.isOverlapping(enemy.hitbox)) {
                    if (!this.player.isHurt()) {
                        this.player.takeDamage();
                        this.hud2.setText(`${healthStr} ${this.player.hitpoints}`);

                        // Check if game over
                        if (this.player.hitpoints > -1) {
                            this.playSFX(`${audioDir}hit.mp3`, 1);
                        } else {
                            if (this.score > this.storage.getHighScore()) {
                                this.storage.addHighScore(this.score);
                                this.newHighScoreFlag = true;
                            }
                            this.playSFX(`${audioDir}failBuzzer.mp3`, 1);
                            this.setMode("death");
                        }
                    }
                }

                // Check if a point has been scored
                if (this.player.hitbox.r < (enemy.hitbox.l + ((enemy.hitbox.r - enemy.hitbox.l)/2)) && !enemy.passedByPlayer) {
                    this.score++;
                    enemy.passedByPlayer = true;
                    this.playSFX(`${audioDir}collect.mp3`, 1);
                    this.hud1.setText(`${scoreStr} ${this.score}`);
                }
            });

        } else { // Make sure player gets to start position
            this.player.moveToStartPos();
        }
    }

    /**
     * Shows the "game over, play again" screen in death mode
     */
    death() {
        // update the HUD, so it doesn't vanish
        this.hud1.setText(`${scoreStr} ${this.score}`);
        this.hud2.setText(`${healthStr} ${this.player.hitpoints}`);
        this.hud4.setText(`${highScoreStr} ${this.storage.getHighScore()}`);

        // keep objects drawn and stop backgrounds
        this.enemyBuffer.forEach(enemy => {
            enemy.draw();
        });
        this.player.draw();
        this.bgl1.stop();
        this.bgl2.stop();
        this.fgl1.stop();

        // show the death layer + text
        this.dl.getContext("2d").clearRect(0, 0, this.dl.width, this.dl.height);
        this.dl.getContext("2d").fillStyle = "rgba(30, 30, 30, 0.4)";
        this.dl.getContext("2d").fillRect(0, 0, this.dl.width, this.dl.height);
        this.showGameOverText();
    }

    /**
     * Restart the game
     */
    restart() {
        this.dl.getContext("2d").clearRect(0, 0, this.dl.width, this.dl.height);
        this.hud3.clear();
        this.hud2.changeColor("#ffffff");
        
        // Clear all game variables
        this.enemyBuffer = [];
        this.player.restoreAllHealth();
        this.score = 0;
        this.newHighScoreFlag = false;

        // Update HUD, player, and backgrounds
        this.hud1.setText(`${scoreStr} ${this.score}`);
        this.hud2.setText(`${healthStr} ${this.player.hitpoints}`);
        this.player.changePosition(760, 340);
        this.player.draw();
        this.bgl1.resume();
        this.bgl2.resume();
        this.fgl1.resume();

        this.setMode("play");
    }

    /**
     * Spawns an enemy on the screen
     */
    spawnEnemy() {
        let enemyTypes = 3;
        let frameTimeTypes = 4;
        let randomEnemy = Math.floor(Math.random() * Math.floor(enemyTypes)) + 1;
        let randomFrameTime = Math.floor(Math.random() * Math.floor(frameTimeTypes)) + 1;

        // Determine the enemy type;
        let enemy = null;

        // TODO: Change these values once other enemies are imlpemented
        let y = 395;
        let x = this.enemySpawnPoint;
        let penguinHitBox = new Hitbox(y + 10, y + 60, x + 20, x + 150);

        switch(randomEnemy) {
            case 1:
                // canvasObj, x, y, slideSpeed, hitbox
                enemy = new Penguin({canvas: game.spriteCanvas}, this.enemySpawnPoint, 395, this.enemySpeed, penguinHitBox);
                break;
            case 2:
                enemy = new Penguin({canvas: game.spriteCanvas}, this.enemySpawnPoint, 395, this.enemySpeed, penguinHitBox);
                //enemy = new Rock();
                break;
            case 3:
                enemy = new Penguin({canvas: game.spriteCanvas}, this.enemySpawnPoint, 395, this.enemySpeed, penguinHitBox);
                //enemy = new Snowman();
                break;
            default:
                enemy = new Penguin({canvas: game.spriteCanvas}, this.enemySpawnPoint, 395, this.enemySpeed, penguinHitBox);
                break;
        }

        // Don't spawn an enemy if the buffer is full
        if (this.enemyBuffer.length < this.enemyLimit) {
            this.enemyBuffer.push(enemy);
        }

        // Determine how many frame to wait until next spawn
        switch(randomFrameTime) {
            case 1:
                this.framesUntilNewSpawn = 135;
                break;
            case 2:
                this.framesUntilNewSpawn = 175;
                break;
            case 3:
                this.framesUntilNewSpawn = 200;
                break;
            case 4:
                this.framesUntilNewSpawn = 80;
                break;
            default:
                this.framesUntilNewSpawn = 135;
                break;
        }
    }

    /**
     * Despawns an enemy
     * 
     * @param {int} bufferIndex 
     */
    despawnEnemy(bufferIndex) {
        this.enemyBuffer.splice(bufferIndex, 1);
    }

    /**
     * Makes all layers visible
     */
    showLayers() {
        this.bgl1.canvas.style.display = "block";
        this.bgl2.canvas.style.display = "block";
        this.fgl1.canvas.style.display = "block";
        this.spriteCanvas.style.display = "block";
        this.hud1.display = "block";
        this.hud2.display = "block";
        this.hud4.display = "block";
    }

    /**
     * Show the game over screen with its respective text
     */
    showGameOverText() {
        let textArray = [
            new UIText({canvas: this.hud3.canvas}, 250, 60, `${gameOverStr}`, 54, 1.15),
            new UIText({canvas: this.hud3.canvas}, 250, 140, `${scoreStr} ${this.score}`, 54, 1.15),
            new UIText({canvas: this.hud3.canvas}, 250, 220, `${resumeStr}`, 32, 1.15),
        ];
        if (this.newHighScoreFlag) {
            textArray.push(new UIText({canvas: this.hud3.canvas}, 250, 280, `${newHighScoreStr}`, 48, 1.15, "yellow"))
        }
        this.hud3.drawTexts(textArray);
    }

    /**
     * Loads background layer 1 (the furthest back layer)
     * 
     * @returns {Background}
     */
    initBgl1(layer) {
        this.bgl1 = new Background(
            {canvas: layer},
            0,
            0,
            1,
            0,
            this.bgl1Speed,
            layer.width,
            layer.height,
            "bgl1.png"
        );
        return this.bgl1;
    }

    /**
     * Loads background layer 2 (the middle layer)
     * 
     * @returns {Background}
     */
    initBgl2(layer) {
        this.bgl2 = new Background(
            {canvas: layer},
            0,
            0,
            1,
            0,
            this.bgl2Speed,
            layer.width,
            layer.height, 
            "bgl2.png"
        );
        return this.bgl2;
    }

    /**
     * Loads the foreground (the layer closest to the screen)
     * 
     * @returns {Background}
     */
    initFgl1(layer) {
        this.fgl1 = new Background(
            {canvas: layer},
            0, 
            0,
            1,
            0,
            this.fgl1Speed,
            layer.width,
            layer.height,
            "fgl1.png"
        );
        return this.fgl1;
    }

    /**
     * Initializes the death layer.
     * Unlike the other "init" functions, this only requires a canvas
     * as the only purpose is to mute all other colours except HUD3
     *  
     * @param {Canvas} layer 
     */
    initDl(layer) {
        this.dl = layer;
    }

    /**
     * Initializes the HUD canvases
     * 
     * @param {HUD} hud1Layer 
     * @param {HUD} hud2Layer 
     * @param {HUD} hud3Layer 
     */
    initHuds(hud1Layer, hud2Layer, hud3Layer, hud4Layer) { 
        this.scoreText = new UIText({canvas: hud1Layer}, 18, 40, `${scoreStr} ${this.score}`, 36, 1.15);
        this.healthText = new UIText({canvas: hud2Layer}, 152, 40, `${healthStr} ${this.player.hitpoints}`, 36, 1.15);
        this.highScoreText = new UIText({canvas: hud4Layer}, 18, 40, `${highScoreStr} ${this.storage.getHighScore()}`, 36, 1.15);
        this.hud1 = new HUD({canvas: hud1Layer}, this.scoreText, true);
        this.hud2 = new HUD({canvas: hud2Layer}, this.healthText, true);
        this.hud3 = new MultiHUD({canvas: hud3Layer}, true);
        this.hud4 = new HUD({canvas: hud4Layer}, this.highScoreText, true);
    }

    /**
     * Loads the title card
     * 
     * @returns {TitleCard}
     */
    initTitleCard(layer) {
        this.titleCard = new TitleCard({canvas: layer}, 0, 0, 256, 128, "title.png");
        return this.titleCard;
    }

    /**
     * 
     */
    initPlayer(layer) {
        this.player = new Player({canvas: layer}, 760, 340, "player-fat.png");
        return this.player;
    }

    /**
     * Halts execution of a thread for a given amount of time
     * 
     * @param {int} ms
     * @return {Promise}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
     
}

/**
 * Loops through game logic to play the game
 */
async function gameLoop() {
    let bgl1 = document.getElementById("bgl1");
    let fgl2 = document.getElementById("fgl2");
    game = new Game(bgl1, fgl2);
    game.storage.deleteHighScore();

    // Initialize game layers
    // We are preloading them, so if the user changes aspect ratio it will not bug out
    game.initBgl1(bgl1);
    game.initTitleCard(fgl2);
    game.initPlayer(fgl2);
    game.initBgl2(document.getElementById("bgl2"));
    game.initFgl1(document.getElementById("fgl1"));
    game.initHuds(
        document.getElementById("hud1"),
        document.getElementById("hud2"),
        document.getElementById("hud3"),
        document.getElementById("hud4")
    );
    game.initDl(document.getElementById("dl"));

    // Boot game
    game.setMode("boot");
    await game.sleep(800).then(() => {
        requestAnimationFrame(game.boot);
    });
    await game.awaitBootFinish().then(() => {
        bootCompleteFlag = true;
        bgl1.getContext("2d").globalAlpha = 1;
    });

    // Start the title sequence
    game.showLayers();
    game.playTrack(`${audioDir}steviaSphere_Dolphin.mp3`, true, 0.5);
    game.titleCard.setCoordinates(330, -138, 330, 60, false);
    game.setMode("menu");

    // This is the game loop
    function loop() {

        game.bgl1.draw();
        game.bgl2.draw();
        game.fgl1.draw();
        game.spriteCanvas.getContext("2d").clearRect(0, 0, 920, 540);

        if (game.modes.menu) { // Main Menu Mode
            game.menu();
        } else if (game.modes.play) { // Gameplay Mode
            game.play();
        } else if (game.modes.death) { // Player lost
            game.death();
        }

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

gameLoop();