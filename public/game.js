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

// HTML elements
const spaceBarKeyCode = "Space";
const bgl1 = document.getElementById("bgl1");
const bgl2 = document.getElementById("bgl2");
const fgl1 = document.getElementById("fgl1");
const fgl2 = document.getElementById("fgl2");
const bgl1Ctx = bgl1.getContext("2d");
const fgl2Ctx = fgl2.getContext("2d");

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
    constructor(canvas, ctx) {
        // Emulate a dark intro screen seen in most games
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // game objects
        this.titleCard = null;
        this.bgl1 = null;
        this.bgl2 = null;
        this.fgl1 = null;
        this.fgl2 = null;
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

        // flags
        this.titleDoneFlag = false;
        this.gameStartingFlag = false;

        // enemy variables
        this.enemyBuffer = [];
        this.enemyLimit = 3;
        this.framesUntilNewSpawn = 35;
        this.enemySpeed = 8;
        this.enemySpawnPoint = -128;

        // game audio
        this.playingTrack = null;

        // game strings
        this.madeByText = new UIText({canvas: fgl2}, 20, (540-30), authorStr, 30, 1.45);
        this.startText = new UIText({canvas: fgl2}, 334, 210, startStr, 24, 1.15);
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
            this.framesUntilNewSpawn--;

            for (let i = 0; i < this.enemyBuffer.length; i++) {
                this.enemyBuffer[i].slideTowardsPlayer();

                if (this.enemyBuffer[i].isOutOfBounds()) {
                    this.despawnEnemy(i);
                } else {
                    this.enemyBuffer[i].draw();
                }
            }

            if (this.framesUntilNewSpawn <= 0) {
                this.spawnEnemy();
            }

            this.player.updatePos();
        } else { // Make sure player gets to start position
            this.player.moveToStartPos();
        }
    }

    /**
     * Makes all layers visible
     */
    showLayers() {
        bgl1.style.display = "block";
        bgl2.style.display = "block";
        fgl1.style.display = "block";
        fgl2.style.display = "block";
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
                // canvasObj, x, y, slideSpeed, hitbox
                enemy = new Penguin({canvas: fgl2}, this.enemySpawnPoint, 395, this.enemySpeed, null);
                break;
            case 2:
                enemy = new Penguin({canvas: fgl2}, this.enemySpawnPoint, 395, this.enemySpeed, null);
                //enemy = new Rock();
                break;
            case 3:
                enemy = new Penguin({canvas: fgl2}, this.enemySpawnPoint, 395, this.enemySpeed, null);
                //enemy = new Snowman();
                break;
            default:
                enemy = new Penguin({canvas: fgl2}, this.enemySpawnPoint, 395, this.enemySpeed, null);
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
     * Loads background layer 1 (the furthest back layer)
     * 
     * @returns {Background}
     */
    initBgl1() {
        this.bgl1 = new Background(
            {canvas: bgl1},
            0,
            0,
            1,
            0,
            this.bgl1Speed,
            bgl1.width,
            bgl1.height,
            "bgl1.png"
        );
        return this.bgl1;
    }

    /**
     * Loads background layer 2 (the middle layer)
     * 
     * @returns {Background}
     */
    initBgl2() {
        this.bgl2 = new Background(
            {canvas: bgl2},
            0,
            0,
            1,
            0,
            this.bgl2Speed,
            bgl2.width,
            bgl2.height, 
            "bgl2.png"
        );
        return this.bgl2;
    }

    /**
     * Loads the foreground (the layer closest to the screen)
     * 
     * @returns {Background}
     */
    initFgl1() {
        this.fgl1 = new Background(
            {canvas: fgl1},
            0, 
            0,
            1,
            0,
            this.fgl1Speed,
            fgl1.width,
            fgl1.height,
            "fgl1.png"
        );
        return this.fgl1;
    }

    /**
     * Loads the title card
     * 
     * @returns {TitleCard}
     */
    initTitleCard() {
        this.titleCard = new TitleCard({canvas: fgl2}, 0, 0, 256, 128, "title.png");
        return this.titleCard;
    }

    /**
     * 
     */
    initPlayer() {
        this.player = new Player({canvas: fgl2}, 760, 340, "guy.png");
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
    game = new Game(bgl1, bgl1Ctx);
    bgl2.style.display = "none";
    fgl1.style.display = "none";

    // Boot game
    game.setMode("boot");
    await game.sleep(800).then(() => {
        requestAnimationFrame(game.boot);
    });
    await game.awaitBootFinish().then(() => {
        bootCompleteFlag = true;
        bgl1Ctx.globalAlpha = 1;
    });

    // Init layers, audio, and starting sprites
    game.initBgl1();
    game.initBgl2();
    game.initFgl1();
    game.initTitleCard();
    game.initPlayer();
    game.showLayers();
    game.playTrack(`${audioDir}steviaSphere_Dolphin.mp3`, true, 0.5);
    game.titleCard.setCoordinates(330, -138, 330, 60, false);
    game.setMode("menu");

    // This is the game loop
    function loop() {

        game.bgl1.draw();
        game.bgl2.draw();
        game.fgl1.draw();
        fgl2Ctx.clearRect(0, 0, 920, 540);

        if (game.modes.menu) { // Main Menu Mode
            game.menu();
        } else if (game.modes.play) { // Gameplay Mode
            game.play();
        }

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

gameLoop();