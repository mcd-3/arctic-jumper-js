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
        scaler.scale(this.spriteCanvas);

        // Emulate a dark intro screen seen in most games
        this.bootCanvasCtx.fillStyle = 'black';
        this.bootCanvasCtx.fillRect(0, 0, this.bootCanvas.width, this.bootCanvas.height);

        // Option menu components
        this.musicSlider = new Slider(
            "musicSlider",
            engine.audioController.getMusicVolume()
        )
        this.sfxSlider = new Slider(
            "sfxSlider",
            engine.audioController.getSFXVolume()
        );
        this.musicSlider.addUpdateListeners(() => {
            engine.audioController.updateMusicVolume(this.musicSlider.getValue());
        });
        this.sfxSlider.addUpdateListeners(() => {
            engine.audioController.updateSFXVolume(this.sfxSlider.getValue());
        });
        this.resetButton = new DeleteButton("resetHighScoreButton");
        this.resetButton.addOnClickListener(() => {
            if (confirm(resetHighscorePrompt)) {
                engine.storage.deleteHighScore();
                engine.storage.setCachedHighscore(0);
                alert(resetHighscoreConfirm);
            }
            this.resetButton.unfocus();
        });

        // game variables
        this.bootTime = 7500;
        this.framerate = 1000 / 70; //60 frames per second
        this.modes = {
            'boot': false,
            'menu': false,
            'play': false,
            'death': false
        };
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
        bootLogo.src = engine.assetsFetcher.getBootImageLocation();

        let bgl1 = document.getElementById("bgl1");
        let bgl1Ctx = bgl1.getContext("2d");

        bootLogo.onload = () => {
            engine.audioController.playTrack(
                engine.assetsFetcher.getBootGameSFXLocation(),
                false
            );
            bgl1Ctx.globalAlpha = 0;
            
            // Fade the logo in
            function fadeIn() {
                if (!engine.flagController.getFlag("bootComplete")) {
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
                if (!engine.flagController.getFlag("bootComplete")) {
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
        let startText = new UIText({canvas: this.spriteCanvas}, 334, 210, startStr, 24, 1.15);

        // Draw the title card moving downwards or stationary if it isn't finished yet
        engine.titleMngr.draw();
        engine.flagController.setFlag("titleDone", engine.titleMngr.isDoneDrawing());

        // Start drawing in the player and moving card off-screen
        if (engine.flagController.getFlag("gameStarting")) {
            optionsStr = "";
            author = "";
            engine.playerMngr.moveToStart();
            if (engine.titleMngr.isDoneDrawing()) {
                engine.storage.setCachedHighscore(engine.storage.getHighScore());
                engine.gfxController.changeHighscoreUISize(36);
                this.setMode("play");
            }
        } else {
            if (engine.flagController.getFlag("titleDone")) {
                startText.draw();
            }
        }

        if (engine.flagController.getFlag("isOptions")) {
            this.options();
        }

        engine.gfxController.drawScore(optionsStr);
        engine.gfxController.drawHighscore(author);
    }

    /**
     * Plays the game in play mode
     */
    play() {
        if (engine.playerMngr.isAtStartPos()) {
            if (!engine.flagController.getFlag("isPaused")) {
    
                this.framesUntilNewSpawn--;
    
                for (let i = 0; i < engine.enemyMngr.getEnemyArray().length; i++) {
                    if (engine.enemyMngr.getEnemyAtIndex(i) != null) {
                        engine.enemyMngr.getEnemyAtIndex(i).slideTowardsPlayer();
    
                        if (engine.enemyMngr.getEnemyAtIndex(i).isOutOfBounds()) {
                            engine.enemyMngr.despawnEnemy(i);
                        } else {
                            engine.enemyMngr.getEnemyAtIndex(i).draw();
                        }
                    }
                }
    
                engine.enemyMngr.spawnEnemy();
    
                engine.playerMngr.updatePos();
    
                engine.enemyMngr.getEnemyArray().forEach(enemy => {
                    if (enemy != null) {
                        // Check if hitboxes overlap
                        if (engine.playerMngr.isOverlappingHitbox(enemy)) {
                            if (!engine.playerMngr.isHurt()) {
                                engine.playerMngr.takeDamage();
        
                                // Check if game over
                                if (engine.playerMngr.isAlive()) {
                                    engine.audioController.playSFX(
                                        engine.assetsFetcher.getHitSFXLocation()
                                    );
                                } else {
                                    if (
                                        engine.storage.getCachedScore() > 
                                        engine.storage.getCachedHighscore()
                                    ) {
                                        engine.storage.addHighScore(
                                            engine.storage.getCachedScore()
                                        );
                                        engine.storage.setCachedHighscore(
                                            engine.storage.getCachedScore()
                                        );
                                        engine.flagController.setFlag("newHighScore", true);
                                    }
                                    engine.audioController.playSFX(
                                        engine.assetsFetcher.getGameOverSFXLocation()
                                    );
                                    this.startGameOverTimer();
                                    this.setMode("death");
                                }
                            }
                        }
        
                        // Check if a point has been scored
                        if (engine.playerMngr.isPassedEnemy(enemy)) {
                            engine.storage.incrementCachedScore();
                            enemy.passedByPlayer = true;
                            engine.audioController.playSFX(
                                engine.assetsFetcher.getScoreSFXLocation()
                            );
                        }
                    }
                });    
            } else { // Show the pause or option menu
                if (!engine.flagController.getFlag("isOptions")) {
                    this.pause();
                    this.stopMovement();
                } else {
                    this.options();
                    engine.playerMngr.draw();
                    engine.enemyMngr.drawEnemies();
                }
            }

            engine.gfxController.drawScore(scoreStr, engine.storage.getCachedScore());
            engine.gfxController.drawHealth(healthStr, engine.playerMngr.getHP());
            engine.gfxController.drawHighscore(
                highScoreStr,
                engine.storage.getCachedHighscore()
            );
        } else { 
            // Make sure player gets to start position
            engine.playerMngr.moveToStart();
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
        engine.gfxController.drawScore(scoreStr, engine.storage.getCachedScore());
        engine.gfxController.drawHealth(healthStr, engine.playerMngr.getHP());
        engine.gfxController.drawHighscore(
            highScoreStr,
            engine.storage.getCachedHighscore()
        );

        // keep objects drawn and stop backgrounds
        this.stopMovement();

        // show the death layer + text
        engine.gfxController.showDeathLayer();
        engine.gfxController.showGameOverScreen(
            engine.flagController.getFlag("gameOverTimerDone"),
            engine.flagController.getFlag("newHighScore"),
            engine.storage.getCachedScore()
        );
    }

    /**
     * Restart the game
     */
    restart() {
        engine.gfxController.hideDeathLayer();
        engine.gfxController.clearTextLayer();
        
        // Clear all game variables
        engine.enemyMngr.clear();
        engine.playerMngr.restoreHP();
        engine.storage.setCachedScore(0);
        engine.flagController.setFlag("newHighScore", false);
        engine.flagController.setFlag("gameOverTimerDone", false);

        // Update HUD, player, and backgrounds
        engine.gfxController.drawScore(scoreStr, engine.storage.getCachedScore());
        engine.gfxController.drawHealth(healthStr, engine.playerMngr.getHP());
        engine.playerMngr.changePos(760, 340);
        engine.playerMngr.draw();
        engine.gfxController.resumeLayerMovements();
        engine.playerMngr.resume();
        engine.playerMngr.resetInvincibility();

        this.setMode("play");
    }

    /**
     * Stops the movement of entities
     */
    stopMovement() {
        if (this.modes.menu) {
            engine.titleMngr.stop();
            engine.gfxController.stopLayerMovements();
        } else {
            engine.enemyMngr.drawEnemies();
            engine.playerMngr.draw();
            engine.gfxController.stopLayerMovements();
            engine.playerMngr.stop();
            engine.enemyMngr.stopEnemies();
        }
    }

    /**
     * Resumes the movement of entities
     */
    resumeMovement() {
        if (this.modes.menu) {
            engine.titleMngr.resume();
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
            engine.playerMngr.resume();
            engine.enemyMngr.resumeEnemies();
        }
    }

    /**
     * Gives a bit of buffer time when the player game overs, so that if 
     * they are holding down the jump button, it won't immediately start again
     */
    startGameOverTimer() {
        let waitTime = 1000;
        this.sleep(waitTime).then(() => {
            engine.flagController.setFlag("gameOverTimerDone", true);
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