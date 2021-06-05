/**
 * game.js
 * 
 * Contains all game functionality and logic
 */
const engine = new Coldwind();

// HTML elements
const spaceBarKeyCode = "Space";
const enterKeyCode = "Enter"

// Program flags
let bootCompleteFlag = false;

// This is the game object
let game;

// Event for pressing space
document.addEventListener('keydown', (e) => {
    if (e.code == spaceBarKeyCode) {
        if (game.modes.menu) {
            if (game.titleDoneFlag && !game.isOptions) { // Play music, get rid of title card
                game.titleCard.setCoordinates(330, 60, 330, -138, true);
                game.gameStartingFlag = true;
                let playSounds = new Promise(resolve => {
                    engine.audioController.playSFX(game.assetsFetcher.getStartGameSFXLocation());
                    resolve(true);
                }).then(value => {
                    engine.audioController.stopTrack();
                    engine.audioController.playTrack(game.assetsFetcher.getMainSongLocation());
                });
            }
        } else if (game.modes.play) {
            if (!game.isPaused) { // jump
                if (game.player.isGrounded) {
                    engine.audioController.playSFX(game.assetsFetcher.getJumpSFXLocation());
                }
                game.player.jump();
            } else { // exit from paused
                if (!game.isOptions) {
                    game.isPaused = false;
                    game.resumeMovement();
                }
            }
        } else if (game.modes.death) {
            if (game.gameOverTimerDone) {
                game.restart();
            }
        }
    } else if (e.code == enterKeyCode) {
        if (game.modes.menu) {
            if (!game.gameStartingFlag) {
                game.isOptions = !game.isOptions;
                game.isOptions ? game.stopMovement() : game.resumeMovement();
            }
        } else if (game.modes.play) {
            if (game.isPaused) { // go to options
                if (game.isOptions) {
                    game.musicSlider.hide();
                    game.sfxSlider.hide();
                    game.resetButton.hide();
                }
                game.isOptions = !game.isOptions;
            } else { // pause the game
                game.isPaused = true;
            }
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
        this.spriteCanvasCtx = scaler.scale(this.spriteCanvas);

        // Emulate a dark intro screen seen in most games
        this.bootCanvasCtx.fillStyle = 'black';
        this.bootCanvasCtx.fillRect(0, 0, this.bootCanvas.width, this.bootCanvas.height);

        // game objects
        this.titleCard = null;
        this.fgl2 = null;
        this.musicSlider = null;
        this.sfxSlider = null;
        this.resetButton = null;
        this.player = null;

        // game variables
        this.bootTime = 7500;
        this.framerate = 1000 / 70; //60 frames per second
        this.modes = {
            'boot': false,
            'menu': false,
            'play': false,
            'death': false
        };
        this.score = 0;
        this.cachedHighscore = 0;

        // flags
        this.titleDoneFlag = false;
        this.gameStartingFlag = false;
        this.newHighScoreFlag = false;
        this.gameOverTimerDone = false;
        this.isOptions = false;
        this.isPaused = false;

        // enemy variables
        this.enemyBuffer = [null, null, null];
        this.enemyLimit = 3;
        this.framesUntilNewSpawn = 35;
        this.enemySpeed = 10;
        this.enemySpawnPointX = -128;
        this.enemySpawnPointY = 395;

        // game storage
        this.storage = new ScoreStorageHelper();
        this.assetsFetcher = new AssetLocationFetcher();
        new PathStorageHelper().initPaths();

        // game strings
        this.startText = new UIText({canvas: this.spriteCanvas}, 334, 210, startStr, 24, 1.15);
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
        bootLogo.src = game.assetsFetcher.getBootImageLocation();

        let bgl1 = document.getElementById("bgl1");
        let bgl1Ctx = bgl1.getContext("2d");

        bootLogo.onload = () => {
            engine.audioController.playTrack(
                game.assetsFetcher.getBootGameSFXLocation(),
                false
            );
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
     * Starts main menu mode
     */
    menu() {
        let optionsStr = optionsMenuStr;
        let author = authorStr;

        // Draw the title card moving downwards or stationary if it isn't finished yet
        this.titleCard.draw();
        this.titleDoneFlag = this.titleCard.isDoneDrawing;

        // Start drawing in the player and moving card off-screen
        if (this.gameStartingFlag) {
            optionsStr = "";
            author = "";
            this.player.moveToStartPos();
            if (this.titleCard.isDoneDrawing) {
                this.cachedHighscore = this.storage.getHighScore();
                engine.gfxController.changeHighscoreUISize(36);
                this.setMode("play");
            }
        } else {
            if (this.titleDoneFlag) {
                this.startText.draw();
            }
        }

        if (this.isOptions) {
            this.options();
        }

        engine.gfxController.drawScore(optionsStr);
        engine.gfxController.drawHighscore(author);
    }

    /**
     * Plays the game in play mode
     */
    play() {
        if (this.player.isAtStartPos()) {
            if (!this.isPaused) {
    
                this.framesUntilNewSpawn--;
    
                for (let i = 0; i < this.enemyBuffer.length; i++) {
                    if (this.enemyBuffer[i] != null) {
                        this.enemyBuffer[i].slideTowardsPlayer();
    
                        if (this.enemyBuffer[i].isOutOfBounds()) {
                            this.despawnEnemy(i);
                        } else {
                            this.enemyBuffer[i].draw();
                        }
                    }
                }
    
                if (this.framesUntilNewSpawn <= 0) {
                    this.spawnEnemy();
                }
    
                this.player.updatePos();
    
                this.enemyBuffer.forEach(enemy => {
                    if (enemy != null) {
                        // Check if hitboxes overlap
                        if (this.player.hitbox.isOverlapping(enemy.hitbox)) {
                            if (!this.player.isHurt()) {
                                this.player.takeDamage();
        
                                // Check if game over
                                if (this.player.hitpoints > 0) {
                                    engine.audioController.playSFX(this.assetsFetcher.getHitSFXLocation());
                                } else {
                                    if (this.score > this.cachedHighscore) {
                                        this.storage.addHighScore(this.score);
                                        this.cachedHighscore = this.score;
                                        this.newHighScoreFlag = true;
                                    }
                                    engine.audioController.playSFX(this.assetsFetcher.getGameOverSFXLocation());
                                    this.startGameOverTimer();
                                    this.setMode("death");
                                }
                            }
                        }
        
                        // Check if a point has been scored
                        if (this.player.hitbox.r < (enemy.hitbox.l + ((enemy.hitbox.r - enemy.hitbox.l)/2)) && !enemy.passedByPlayer) {
                            this.score++;
                            enemy.passedByPlayer = true;
                            engine.audioController.playSFX(this.assetsFetcher.getScoreSFXLocation());
                        }
                    }
                });    
            } else { // Show the pause or option menu
                if (!this.isOptions) {
                    this.pause();
                    this.stopMovement();
                } else {
                    this.options();
                    this.player.draw();
                    this.drawEnemies();
                }
            }

            engine.gfxController.drawScore(scoreStr, this.score);
            engine.gfxController.drawHealth(healthStr, this.player.hitpoints);
            engine.gfxController.drawHighscore(highScoreStr, this.cachedHighscore);
        } else { // Make sure player gets to start position
            this.player.moveToStartPos();
        }
    }

    /**
     * Toggles the pause screen
     */
    pause() {
        engine.gfxController.showDeathLayer();
        engine.gfxController.showPauseScreen();
    }

    /**
     * Toggles the options screen
     */
    options() {
        engine.gfxController.showDeathLayer();
        engine.gfxController.showOptionsScreen();
        this.musicSlider.show();
        this.sfxSlider.show();
        this.resetButton.show();
    }

    /**
     * Shows the "game over, play again" screen in death mode
     */
    death() {
        // update the HUD, so it doesn't vanish
        engine.gfxController.drawScore(scoreStr, this.score);
        engine.gfxController.drawHealth(healthStr, this.player.hitpoints);
        engine.gfxController.drawHighscore(highScoreStr, this.cachedHighscore);

        // keep objects drawn and stop backgrounds
        this.stopMovement();

        // show the death layer + text
        engine.gfxController.showDeathLayer();
        engine.gfxController.showGameOverScreen(
            this.gameOverTimerDone,
            this.newHighScoreFlag,
            this.score
        );
    }

    /**
     * Restart the game
     */
    restart() {
        engine.gfxController.hideDeathLayer();
        engine.gfxController.clearTextLayer();
        
        // Clear all game variables
        this.enemyBuffer = [null, null, null];
        this.player.restoreAllHealth();
        this.score = 0;
        this.newHighScoreFlag = false;
        this.gameOverTimerDone = false;

        // Update HUD, player, and backgrounds
        engine.gfxController.drawScore(scoreStr, this.score);
        engine.gfxController.drawHealth(healthStr, this.player.hitpoints);
        this.player.changePosition(760, 340);
        this.player.draw();
        engine.gfxController.resumeLayerMovements();
        this.player.resume();
        this.player.resetInvincibility();

        this.setMode("play");
    }

    /**
     * Stops the movement of entities
     */
    stopMovement() {
        if (this.modes.menu) {
            this.titleCard.stop();
            engine.gfxController.stopLayerMovements();
        } else {
            this.drawEnemies();
            this.player.draw();
            engine.gfxController.stopLayerMovements();
            this.player.stop();
            this.enemyBuffer.forEach(enemy => {
                if (enemy != null) {
                    enemy.stop();
                }
            });
        }
    }

    /**
     * Resumes the movement of entities
     */
    resumeMovement() {
        if (this.modes.menu) {
            this.titleCard.resume();
            engine.gfxController.resumeLayerMovements();
            engine.gfxController.hideDeathLayer();
            engine.gfxController.clearTextLayer();
            this.musicSlider.hide();
            this.sfxSlider.hide();
            this.resetButton.hide();
        } else {
            engine.gfxController.resumeLayerMovements();
            engine.gfxController.hideDeathLayer();
            engine.gfxController.clearTextLayer();
            this.player.resume();
            this.enemyBuffer.forEach(enemy => {
                if (enemy != null) {
                    enemy.resume();
                }
            });
        }
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
        switch(randomEnemy) {
            case 1:
                let spawnPenguinY = this.enemySpawnPointY;
                enemy = new Penguin({canvas: game.spriteCanvas}, this.enemySpawnPointX, spawnPenguinY, this.enemySpeed);
                enemy.setHitbox(new Hitbox(
                    spawnPenguinY + 25,
                    spawnPenguinY + 70,
                    this.enemySpawnPointX + 20,
                    this.enemySpawnPointX + (enemy.getWidth() - 20)
                ));
                break;
            case 2:
                let spawnRockY = this.enemySpawnPointY + 10;
                enemy = new Rock({canvas: game.spriteCanvas}, this.enemySpawnPointX, spawnRockY, this.enemySpeed);
                enemy.setHitbox(new Hitbox(
                    spawnRockY + 10,
                    spawnRockY + 62,
                    this.enemySpawnPointX + 4,
                    this.enemySpawnPointX + (enemy.getWidth() - 4)
                ));
                break;
            case 3:
            default:
                let spawnSnowmanY = this.enemySpawnPointY - 55;
                enemy = new Snowman({canvas: game.spriteCanvas}, this.enemySpawnPointX, spawnSnowmanY, this.enemySpeed);
                enemy.setHitbox(new Hitbox(
                    spawnSnowmanY + 10,
                    spawnSnowmanY + 124,
                    this.enemySpawnPointX + 12,
                    this.enemySpawnPointX + (enemy.getWidth() - 12)
                ));
                break;
        }

        // Don't spawn an enemy if the buffer is full
        for (let i = 0; i < this.enemyBuffer.length; i++) {
            if (this.enemyBuffer[i] == null) {
                this.enemyBuffer[i] = enemy;
                break;
            }
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
        this.enemyBuffer[bufferIndex] = null;
    }

    /**
     * Makes all layers visible
     */
    showLayers() {
        engine.gfxController.showLayers();
        this.spriteCanvas.style.display = "block";
        engine.gfxController.showHUDs();
    }

    /**
     * Draws all enemies
     */
    drawEnemies() {
        this.enemyBuffer.forEach(enemy => {
            if (enemy != null) {
                enemy.draw();
            }
        });
    }

    /**
     * Initializes the sliders on the options screen
     * 
     * @param {string} musicId 
     * @param {string} sfxId 
     */
    initSliders(musicId, sfxId) {
        this.musicSlider = new Slider(musicId);
        this.musicSlider.setValue(engine.audioController.getMusicVolume());
        this.sfxSlider = new Slider(sfxId);
        this.sfxSlider.setValue(engine.audioController.getSFXVolume());
    }

    /**
     * Initializes the reset highscore button on the options screen
     * 
     * @param {string} btnId 
     */
    initResetButton(btnId) {
        this.resetButton = new DeleteButton(btnId);
    }

    /**
     * Loads the title card
     * 
     * @returns {TitleCard}
     */
    initTitleCard(layer) {
        this.titleCard = new TitleCard({canvas: layer}, 0, 0, 256, 128, this.assetsFetcher.getTitleImageLocation());
        return this.titleCard;
    }

    /**
     * 
     */
    initPlayer(layer) {
        this.player = new Player({canvas: layer}, 760, 340, this.assetsFetcher.getPlayerImageLocation());
        return this.player;
    }

    /**
     * Initializes callbacks for volume sliders to update game audio
     */
    initSliderCallbacks() {
        this.musicSlider.addUpdateListeners(() => {
            engine.audioController.updateMusicVolume(this.musicSlider.getValue());
        });
        this.sfxSlider.addUpdateListeners(() => {
            engine.audioController.updateSFXVolume(this.sfxSlider.getValue());
        });
    }

    /**
     * Initializes callbacks for reset highscore button to reset highscore
     */
    initResetButtonCallbacks() {
        this.resetButton.addOnClickListener(() => {
            if (confirm(resetHighscorePrompt)) {
                game.storage.deleteHighScore();
                game.cachedHighscore = 0;
                alert(resetHighscoreConfirm);
            }
            this.resetButton.unfocus();
        });
    }

    /**
     * Gives a bit of buffer time when the player game overs, so that if 
     * they are holding down the jump button, it won't immediately start again
     */
    startGameOverTimer() {
        let waitTime = 1000;
        this.sleep(waitTime).then(() => {
            this.gameOverTimerDone = true;
        });
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

    // Initialize game layers
    // We are preloading them, so if the user changes aspect ratio it will not bug out
    game.initTitleCard(fgl2);
    game.initPlayer(fgl2);
    game.initSliders("musicSlider", "sfxSlider");
    game.initResetButton("resetHighScoreButton");
    game.initSliderCallbacks();
    game.initResetButtonCallbacks();

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
    engine.audioController.playTrack(game.assetsFetcher.getTitleScreenSongLocation());
    game.titleCard.setCoordinates(330, -138, 330, 60, false);
    game.setMode("menu");

    let prevTime = Date.now();

    // This is the game loop
    function loop() {
        let currTime = Date.now();

        if ((currTime - prevTime) > game.framerate) {
            engine.gfxController.drawLayers();
            game.spriteCanvas.getContext("2d").clearRect(0, 0, 920, 540);
    
            if (game.modes.menu) { // Main Menu Mode
                game.menu();
            } else if (game.modes.play) { // Gameplay Mode
                game.play();
            } else if (game.modes.death) { // Player lost
                game.death();
            }
            prevTime = currTime;
        }
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

gameLoop();