/**
 * game.js
 * 
 * Contains all game functionality and logic
 */
let assetsDir = "./assets/";
let audioDir = `${assetsDir}audio/`;
let imagesDir = `${assetsDir}images/`;

const bgl1 = document.getElementById("bgl1");
const bgl2 = document.getElementById("bgl2");
const fgl1 = document.getElementById("fgl1");
const fgl2 = document.getElementById("fgl2");
const bgl1Ctx = bgl1.getContext("2d");

let bootCompleteFlag = false;

class Game {

    constructor(canvas, ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // game variables
        this.bootTime = 7500;
        this.isMenuMode = false;
        this.bgl1Speed = 50;
        this.bgl2Speed = 20;
        this.fgl1Speed = 7;
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
        return new Background({canvas: bgl1}, 0, 0, 1, 0, this.bgl1Speed, bgl1.width, bgl1.height, "bgl1.png");
    }

    /**
     * Loads background layer 2 (the middle layer)
     */
    initBgl2() {
        return new Background({canvas: bgl2}, 0, 0, 1, 0, this.bgl2Speed, bgl2.width, bgl2.height, "bgl2.png");
    }

    /**
     * Loads the foreground (the layer closest to the screen)
     */
    initFgl1() {
        return new Background({canvas: fgl1}, 0, 0, 1, 0, this.fgl1Speed, fgl1.width, fgl1.height, "fgl1.png");
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
    let game = new Game(bgl1, bgl1Ctx);
    bgl2.style.display = "none";
    fgl1.style.display = "none";

    // Boot game
    await game.sleep(800).then(() => {
        // just a little flair to make it look like it needs time to load
        requestAnimationFrame(game.boot);
    });
    await game.awaitBootFinish().then(() => {
        bootCompleteFlag = true;
    });
    bgl1Ctx.globalAlpha = 1;

    // Init layers
    let canvasBgl1 = game.initBgl1();
    let canvasBgl2 = game.initBgl2();
    let canvasFgl1 = game.initFgl1();
    game.showLayers();

    // Play the game music
    let gameMusic = new Audio(`${audioDir}steviaSphere_Dolphin.mp3`);
    gameMusic.play();

    // This is the game loop
    function loop() {
        canvasBgl1.draw();
        canvasBgl2.draw();
        canvasFgl1.draw();

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

gameLoop();