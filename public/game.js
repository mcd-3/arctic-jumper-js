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

    // FIXME: We should only request animation frame in the UPDATE function
    // FIXME: Also the Background object should have a draw function
    /**
     * Loads background layer 1 (the furthest back layer)
     */
    loadBgl1() {
        console.log("made it")
        let img = new Image();
        img.src = `${imagesDir}bgl1.png`;
        let bg = new Background(canvas, 0, 0, 1, 0, 30, canvas.width, canvas.height, img);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bg.image.onload = () => {
            console.log("over here")
            setInterval(() => {
                console.log("here")
                // draw additional image1
                if (bg.x > 0) {
                    ctx.drawImage(bg.image, -bg.imgW + bg.x, bg.y, bg.imgW, bg.imgH);
                }
                // draw additional image2
                if (bg.x - bg.imgW > 0) {
                    ctx.drawImage(bg.image, -bg.imgW * 2 + bg.x, bg.y, bg.imgW, bg.imgH);
                }
                ctx.drawImage(bg.image, bg.x, bg.y, bg.imgW, bg.imgH);
                // amount to move
                bg.x += bg.dx;
            },
            bg.speed
        )};
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

    game.loadBgl1();
}

gameLoop();