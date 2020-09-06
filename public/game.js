/**
 * game.js
 * 
 * Contains all game functionality and logic
 */

let assetsDir = "./assets/";
let audioDir = `${assetsDir}audio/`;
let imagesDir = `${assetsDir}images/`
let framerate = 1000/60;

const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

class Game {

    constructor(canvas, ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // game variables
        this.bootTime = 7500;
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
                ctx.globalAlpha += 0.02;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(bootLogo, 0, 0);
    
                if (ctx.globalAlpha < 1.0) {
                    requestAnimationFrame(fadeIn);    
                }
            }

            // Fade the logo out
            function fadeOut() {
                ctx.globalAlpha -= 0.05;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(bootLogo, 0, 0);
    
                if (ctx.globalAlpha > 0) {
                    requestAnimationFrame(fadeOut);    
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
        console.log("game booted!");
    });
}

gameLoop();