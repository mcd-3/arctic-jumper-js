/**
 * game.js
 * 
 * Contains all game functionality and logic
 */
const assetsDir = "./assets/";
const audioDir = `${assetsDir}audio/`;
const imagesDir = `${assetsDir}images/`;

const spaceBarKeyCode = 32;
const bgl1 = document.getElementById("bgl1");
const bgl2 = document.getElementById("bgl2");
const fgl1 = document.getElementById("fgl1");
const fgl2 = document.getElementById("fgl2");
const bgl1Ctx = bgl1.getContext("2d");
const fgl2Ctx = fgl2.getContext("2d");

let bootCompleteFlag = false;
let titleDoneFlag = false;
let gameStartingFlag = false;

// This is the game object
let game;

// Press space
document.addEventListener('keydown', (e) => {
    if (e.keyCode == spaceBarKeyCode) {
        if (game.modes.menu) {
            if (titleDoneFlag) {
                game.titleCard.setCoordinates(330, 60, 330, -138, true);
                gameStartingFlag = true;
            }
        } else if (game.modes.play) {
            alert("play");
        }
    }
});

class Game {

    constructor(canvas, ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // game objects
        this.titleCard = null;
        this.bgl1 = null;
        this.bgl2 = null;
        this.fgl1 = null;
        this.fgl2 = null;

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
     * Play a music track
     * 
     * @param {strong} track 
     * @param {boolean} isLoop 
     * @param {float} volume 
     * @returns {Audio}
     */
    playTrack(track, isLoop, volume) {
        let gameMusic = new Audio(track);
        gameMusic.loop = isLoop;
        gameMusic.volume = volume;
        gameMusic.play();
        return gameMusic;
    }

    /**
     * Goes to the main menu
     */
    menu() {

    }

    /**
     * Start a new game
     */
    start() {

    }

    /**
     * Updates the game logic every frame
     */
    update() {
        
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
     * Loads background layer 1 (the furthest back layer)
     * 
     * @returns {Background}
     */
    initBgl1() {
        this.bgl1 = new Background({canvas: bgl1}, 0, 0, 1, 0, this.bgl1Speed, bgl1.width, bgl1.height, "bgl1.png");
        return this.bgl1;
    }

    /**
     * Loads background layer 2 (the middle layer)
     * 
     * @returns {Background}
     */
    initBgl2() {
        this.bgl2 = new Background({canvas: bgl2}, 0, 0, 1, 0, this.bgl2Speed, bgl2.width, bgl2.height, "bgl2.png");
        return this.bgl2;
    }

    /**
     * Loads the foreground (the layer closest to the screen)
     * 
     * @returns {Background}
     */
    initFgl1() {
        this.fgl1 = new Background({canvas: fgl1}, 0, 0, 1, 0, this.fgl1Speed, fgl1.width, fgl1.height, "fgl1.png");
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
    console.table(game.modes);
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
    game.showLayers();
    game.playTrack(`${audioDir}steviaSphere_Dolphin.mp3`, true, 0.5)
    game.titleCard.setCoordinates(330, -138, 330, 60, false);
    game.setMode("menu");

    // This is the game loop
    function loop() {

        game.bgl1.draw();
        game.bgl2.draw();
        game.fgl1.draw();
        fgl2Ctx.clearRect(0, 0, 920, 540);

        if (game.modes.menu) { // Main Menu Mode
            game.titleCard.draw();
            titleDoneFlag = game.titleCard.isDoneDrawing;

            if (gameStartingFlag) {
                if (game.titleCard.isDoneDrawing) {
                    game.setMode("play");
                }
            }
        } else if (game.modes.play) { // Gameplay Mode

        }

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

gameLoop();