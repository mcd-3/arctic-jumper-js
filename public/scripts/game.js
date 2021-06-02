/**
 * game.js
 * 
 * Contains all game functionality and logic
 */

// Text strings
const authorStr = "Made by: Matthew C-D";
const startStr = "-- Press Space to Start --";
const optionsMenuStr = "Options: Enter Key";
const healthStr = "Health: ";
const scoreStr = "Score: ";
const highScoreStr = "High Score: ";
const gameOverStr = "Game Over!";
const resumeStr = "-- Press Space to Play Again --";
const newHighScoreStr = "New High Score!";
const optionsStr = "Options";
const musicOptionStr = "Music:";
const sfxOptionStr = "SFX:";
const resetHighscoreStr = "Reset Highscore:";
const exitOptionsStr = "-- Press Enter to Exit Options --";
const pauseStr = "Paused";
const resumeGameStr = "-- Press Space to Resume --";
const gotoOptionsStr = "-- Press Enter to go to Options --";
const resetHighscorePrompt = "Are you sure you want to reset your highscore?\n\nThis action cannot be undone!";
const resetHighscoreConfirm = "Highscore has been reset!";

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
                    game.playSFX(game.assetsFetcher.getStartGameSFXLocation(), game.volumeSettings.getUserSFXVolume());
                    resolve(true);
                }).then(value => {
                    game.stopTrack();
                    game.playTrack(game.assetsFetcher.getMainSongLocation(), true, game.volumeSettings.getUserMusicVolume());
                });
            }
        } else if (game.modes.play) {
            if (!game.isPaused) { // jump
                if (game.player.isGrounded) {
                    game.playSFX(game.assetsFetcher.getJumpSFXLocation(), game.volumeSettings.getUserSFXVolume());
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
        this.hud5 = null;
        this.musicSlider = null;
        this.sfxSlider = null;
        this.resetButton = null;
        this.player = null;

        // game variables
        this.bootTime = 7500;
        this.framerate = 1000 / 70; //60 frames per second
        this.bgl1Speed = 1;
        this.bgl2Speed = 4;
        this.fgl1Speed = 9;
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

        // game audio
        this.playingTrack = null;

        // game storage
        this.storage = new ScoreStorageHelper();
        this.assetsFetcher = new AssetLocationFetcher();
        this.volumeSettings = new VolumeSettings();
        new PathStorageHelper().initPaths();

        // game strings
        this.madeByText = null;
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
        bootLogo.src = game.assetsFetcher.getBootImageLocation();

        let bgl1 = document.getElementById("bgl1");
        let bgl1Ctx = bgl1.getContext("2d");

        bootLogo.onload = () => {
            let bootSfx = new Audio(game.assetsFetcher.getBootGameSFXLocation());
            bootSfx.volume = game.volumeSettings.getUserMusicVolume();
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

        // Start drawing in the player and moving card off-screen
        if (this.gameStartingFlag) {
            this.hud1.setText("");
            this.hud4.setText("");
            this.hud4.drawText();
            this.player.moveToStartPos();
            if (this.titleCard.isDoneDrawing) {
                this.setMode("play");
                this.hud4.setUIText(this.highScoreText);
            }
        } else {
            if (this.titleDoneFlag) {
                this.startText.draw();
            }
            this.hud4.drawText();
        }
        this.hud1.drawText();

        if (this.isOptions) {
            this.options();
        }
    }

    /**
     * Plays the game in play mode
     */
    play() {
        if (this.player.isAtStartPos()) {
            this.hud1.setText(`${scoreStr} ${this.score}`);
            if (!this.isPaused) {
                if (this.player.hitpoints < 2) {
                    this.hud2.changeColor("#ff0000");
                }
    
                // Draw the HUD first
                this.hud1.drawText();
                this.hud2.drawText();
                this.hud4.drawText();
    
                this.framesUntilNewSpawn--;
    
                for (let i = 0; i < this.enemyBuffer.length; i++) {
                    if (this.enemyBuffer[i] != null) {
                        this.enemyBuffer[i].slideTowardsPlayer();
    
                        if (this.enemyBuffer[i].isOutOfBounds()) {
                            this.despawnEnemy(i);
                        } else {
                            this.enemyBuffer[i].draw();
                            //this.enemyBuffer[i].hitbox.debugDrawHitbox(this.spriteCanvasCtx);
                        }
                    }
                }
    
                if (this.framesUntilNewSpawn <= 0) {
                    this.spawnEnemy();
                }
    
                this.player.updatePos();
                //this.player.hitbox.debugDrawHitbox(this.spriteCanvasCtx);
    
                this.enemyBuffer.forEach(enemy => {
                    if (enemy != null) {
                        // Check if hitboxes overlap
                        if (this.player.hitbox.isOverlapping(enemy.hitbox)) {
                            if (!this.player.isHurt()) {
                                this.player.takeDamage();
                                this.hud2.setText(`${healthStr} ${this.player.hitpoints}`);
        
                                // Check if game over
                                if (this.player.hitpoints > 0) {
                                    this.playSFX(this.assetsFetcher.getHitSFXLocation(), this.volumeSettings.getUserSFXVolume());
                                } else {
                                    if (this.score > this.storage.getHighScore()) {
                                        this.storage.addHighScore(this.score);
                                        this.newHighScoreFlag = true;
                                    }
                                    this.playSFX(this.assetsFetcher.getGameOverSFXLocation(), this.volumeSettings.getUserSFXVolume());
                                    this.startGameOverTimer();
                                    this.hud2.changeColor("#585858");
                                    this.hud2.drawText();
                                    this.setMode("death");
                                }
                            }
                        }
        
                        // Check if a point has been scored
                        if (this.player.hitbox.r < (enemy.hitbox.l + ((enemy.hitbox.r - enemy.hitbox.l)/2)) && !enemy.passedByPlayer) {
                            this.score++;
                            enemy.passedByPlayer = true;
                            this.playSFX(this.assetsFetcher.getScoreSFXLocation(), this.volumeSettings.getUserSFXVolume());
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
        } else { // Make sure player gets to start position
            this.player.moveToStartPos();
        }
    }

    /**
     * Toggles the pause screen
     */
    pause() {
        this.muteColors();
        let textArray = [
            new UIText({canvas: this.hud5.canvas}, 375, 60, pauseStr, 54, 1.15),
            new UIText({canvas: this.hud5.canvas}, 375, 200, resumeGameStr, 28, 1.15),
            new UIText({canvas: this.hud5.canvas}, 375, 280, gotoOptionsStr, 28, 1.15),
        ];
        this.hud5.drawTexts(textArray);
    }

    /**
     * Toggles the options screen
     */
    options() {
        this.muteColors();
        let textArray = [
            new UIText({canvas: this.hud5.canvas}, 375, 60, optionsStr, 54, 1.15),
            new UIText({canvas: this.hud5.canvas}, 268, 140, musicOptionStr, 32, 1.15),
            new UIText({canvas: this.hud5.canvas}, 280, 220, sfxOptionStr, 32, 1.15),
            new UIText({canvas: this.hud5.canvas}, 208, 300, resetHighscoreStr, 32, 1.15),
            new UIText({canvas: this.hud5.canvas}, 375, 400, exitOptionsStr, 28, 1.15),
        ];
        this.hud5.drawTexts(textArray);
        this.musicSlider.show();
        this.sfxSlider.show();
        this.resetButton.show();
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
        this.stopMovement();

        // show the death layer + text
        this.muteColors();
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
        this.enemyBuffer = [null, null, null];
        this.player.restoreAllHealth();
        this.score = 0;
        this.newHighScoreFlag = false;
        this.gameOverTimerDone = false;

        // Update HUD, player, and backgrounds
        this.hud1.setText(`${scoreStr} ${this.score}`);
        this.hud2.setText(`${healthStr} ${this.player.hitpoints}`);
        this.player.changePosition(760, 340);
        this.player.draw();
        this.bgl1.resume();
        this.bgl2.resume();
        this.fgl1.resume();
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
            this.bgl1.stop();
            this.bgl2.stop();
            this.fgl1.stop();
        } else {
            this.drawEnemies();
            this.player.draw();
            this.bgl1.stop();
            this.bgl2.stop();
            this.fgl1.stop();
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
            this.bgl1.resume();
            this.bgl2.resume();
            this.fgl1.resume();
            this.unmuteColors();
            this.hud5.clear();
            this.musicSlider.hide();
            this.sfxSlider.hide();
            this.resetButton.hide();
        } else {
            this.bgl1.resume();
            this.bgl2.resume();
            this.fgl1.resume();
            this.unmuteColors();
            this.hud5.clear();
            this.player.resume();
            this.enemyBuffer.forEach(enemy => {
                if (enemy != null) {
                    enemy.resume();
                }
            });
        }
    }

    /**
     * Makes the screen turn grey
     */
    muteColors() {
        this.dl.getContext("2d").clearRect(0, 0, this.dl.width, this.dl.height);
        this.dl.getContext("2d").fillStyle = "rgba(30, 30, 30, 0.6)";
        this.dl.getContext("2d").fillRect(0, 0, this.dl.width, this.dl.height);
    }

    /**
     * Clears the grey color from the screen
     */
    unmuteColors() {
        this.dl.getContext("2d").clearRect(0, 0, this.dl.width, this.dl.height);
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
        this.enemyBuffer[bufferIndex] = null;//.splice(bufferIndex, 1);
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
        ];

        if (this.gameOverTimerDone) {
            textArray.push(new UIText({canvas: this.hud3.canvas}, 250, 220, `${resumeStr}`, 32, 1.15));
        }

        if (this.newHighScoreFlag) {
            textArray.push(new UIText({canvas: this.hud3.canvas}, 250, 280, `${newHighScoreStr}`, 48, 1.15, "yellow"))
        }

        this.hud3.drawTexts(textArray);
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
            this.assetsFetcher.getBGL1ImageLocation()
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
            this.assetsFetcher.getBGL2ImageLocation()
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
            (540 - 154),
            1,
            0,
            this.fgl1Speed,
            layer.width,
            layer.height,
            this.assetsFetcher.getFGL1ImageLocation()
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
    initHuds(hud1Layer, hud2Layer, hud3Layer, hud4Layer, hud5Layer) { 
        this.scoreText = new UIText({canvas: hud1Layer}, 18, 40, optionsMenuStr, 36, 1.15);
        this.healthText = new UIText({canvas: hud2Layer}, 152, 40, `${healthStr} ${this.player.hitpoints}`, 36, 1.15);
        this.highScoreText = new UIText({canvas: hud4Layer}, 18, 40, `${highScoreStr} ${this.storage.getHighScore()}`, 36, 1.15);
        this.madeByText = new UIText({canvas: hud4Layer}, 18, 40, authorStr, 28, 1.15);
        this.hud1 = new HUD({canvas: hud1Layer}, this.scoreText, true);
        this.hud2 = new HUD({canvas: hud2Layer}, this.healthText, true);
        this.hud3 = new MultiHUD({canvas: hud3Layer}, true);
        this.hud4 = new HUD({canvas: hud4Layer}, this.madeByText, true);
        this.hud5 = new MultiHUD({canvas: hud5Layer}, true)
    }

    /**
     * Initializes the sliders on the options screen
     * 
     * @param {string} musicId 
     * @param {string} sfxId 
     */
    initSliders(musicId, sfxId) {
        this.musicSlider = new Slider(musicId);
        this.musicSlider.setValue(this.volumeSettings.getUserMusicVolume());
        this.sfxSlider = new Slider(sfxId);
        this.sfxSlider.setValue(this.volumeSettings.getUserSFXVolume());
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
            let sliderVal = this.musicSlider.getValue();
            game.volumeSettings.setUserMusicVolume(sliderVal);
            game.playingTrack.volume = sliderVal;
        }, () => {
            game.volumeSettings.saveUserMusicVolume();
        });
        this.sfxSlider.addUpdateListeners(() => {
            game.volumeSettings.setUserSFXVolume(this.sfxSlider.getValue());
        }, () => {
            game.volumeSettings.saveUserSFXVolume();
        })
    }

    /**
     * Initializes callbacks for reset highscore button to reset highscore
     */
    initResetButtonCallbacks() {
        this.resetButton.addOnClickListener(() => {
            if (confirm(resetHighscorePrompt)) {
                game.storage.deleteHighScore();
                if (!game.modes.menu) {
                    this.hud4.setText(`${highScoreStr} 0`);
                }
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
    //game.storage.deleteHighScore();

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
        document.getElementById("hud4"),
        document.getElementById("hud5")
    );
    game.initSliders("musicSlider", "sfxSlider");
    game.initResetButton("resetHighScoreButton");
    game.initSliderCallbacks();
    game.initResetButtonCallbacks();
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
    game.playTrack(game.assetsFetcher.getTitleScreenSongLocation(), true, game.volumeSettings.getUserMusicVolume());
    game.titleCard.setCoordinates(330, -138, 330, 60, false);
    game.setMode("menu");

    let prevTime = Date.now();

    // This is the game loop
    function loop() {
        let currTime = Date.now();

        if ((currTime - prevTime) > game.framerate) {
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
            prevTime = currTime;
        }
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

gameLoop();