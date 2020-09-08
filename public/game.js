/**
 * game.js
 * 
 * Contains all game functionality and logic
 */
let assetsDir = "./assets/";
let audioDir = `${assetsDir}audio/`;
let imagesDir = `${assetsDir}images/`;

const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

let bootCompleteFlag = false;

class Game {

    constructor(canvas, ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // game variables
        this.bootTime = 7500;
        this.isMenuMode = false;
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
            ctx.globalAlpha = 0;
            
            // Fade the logo in
            function fadeIn() {
                if (!bootCompleteFlag) {
                    ctx.globalAlpha += 0.02;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(bootLogo, 0, 0);
        
                    if (ctx.globalAlpha < 1.0) {
                        requestAnimationFrame(fadeIn);    
                    }
                }
            }

            // Fade the logo out
            function fadeOut() {
                if (!bootCompleteFlag) {
                    ctx.globalAlpha -= 0.05;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(bootLogo, 0, 0);
        
                    if (ctx.globalAlpha > 0) {
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
     * Loads background layer 1 (the furthest back layer)
     * 
     * @returns {Background}
     */
    initBgl1() {
        return new Background({canvas}, 0, 0, 1, 0, 30, canvas.width, canvas.height, "bgl1.png");
    }

    /**
     * Loads background layer 2 (the middle layer)
     */
    loadBgl2() {

    }

    /**
     * Loads the foreground (the layer closest to the screen)
     */
    loadFgl() {

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
    let game = new Game(canvas, ctx);

    // Boot game
    await game.sleep(800).then(() => {
        // just a little flair to make it look like it needs time to load
        requestAnimationFrame(game.boot);
    });
    await game.awaitBootFinish().then(() => {
        bootCompleteFlag = true;
    });
    ctx.globalAlpha = 1;

    // Init layers
    let bgl1 = game.initBgl1();

    // This is the game loop
    function loop() {
        bgl1.draw();
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

gameLoop();