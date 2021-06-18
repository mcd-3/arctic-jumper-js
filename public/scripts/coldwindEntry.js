/**
 * coldwindEntry.js
 * 
 * Entry point for the Coldwind engine and for the Game logic
 */
const engine = new Coldwind();
const game = new Game(
    document.getElementById("bgl1"),
    document.getElementById("fgl2")
);

// HTML elements
const spaceBarKeyCode = "Space";
const enterKeyCode = "Enter";

// Event for pressing space
document.addEventListener('keydown', (e) => {
    if (e.code == spaceBarKeyCode) {
        if (game.modes.menu) {
            if (
                engine.flagController.getFlag("titleDone") 
                && !engine.flagController.getFlag("isOptions")
            ) {
                // Play music, get rid of title card
                engine.titleMngr.setCoordinates(330, 60, 330, -138, true);
                engine.flagController.setFlag("gameStarting", true);
                new Promise(resolve => {
                    engine.audioController.playSFX(
                        engine.assetsFetcher.getStartGameSFXLocation()
                    );
                    resolve(true);
                }).then(() => {
                    engine.audioController.stopTrack();
                    engine.audioController.playTrack(
                        engine.assetsFetcher.getMainSongLocation()
                    );
                });
            }
        } else if (game.modes.play) {
            if (!engine.flagController.getFlag("isPaused")) {
                // jump
                if (engine.playerMngr.isGrounded()) {
                    engine.audioController.playSFX(
                        engine.assetsFetcher.getJumpSFXLocation()
                    );
                }
                engine.playerMngr.jump();
            } else {
                // exit from paused
                if (!engine.flagController.getFlag("isOptions")) {
                    engine.flagController.setFlag("isPaused", false);
                    game.resumeMovement();
                }
            }
        } else if (game.modes.death) {
            if (engine.flagController.getFlag("gameOverTimerDone")) {
                game.restart();
            }
        }
    } else if (e.code == enterKeyCode) {
        if (game.modes.menu) {
            if (!engine.flagController.getFlag("gameStarting")) {
                engine.flagController.setFlag(
                    "isOptions",
                    !engine.flagController.getFlag("isOptions")
                );
                engine.flagController.getFlag("isOptions")
                    ? game.stopMovement()
                    : game.resumeMovement();
            }
        } else if (game.modes.play) {
            if (engine.flagController.getFlag("isPaused")) {
                // go to options
                if (engine.flagController.getFlag("isOptions")) {
                    game.musicSlider.hide();
                    game.sfxSlider.hide();
                    game.resetButton.hide();
                }
                engine.flagController.setFlag(
                    "isOptions",
                    !engine.flagController.getFlag("isOptions")
                );
            } else {
                // pause the game
                engine.flagController.setFlag("isPaused", true);
            }
        }
    }
});


/**
 * Loops through game logic to play the game
 */
async function gameLoop() {
    // Boot game
    game.setMode("boot");
    await game.sleep(800).then(() => {
        requestAnimationFrame(game.boot);
    });
    await game.awaitBootFinish().then(() => {
        engine.flagController.setFlag("bootComplete", true);
        bgl1.getContext("2d").globalAlpha = 1;
    });

    // Start the title sequence
    engine.gfxController.showLayers();
    engine.audioController.playTrack(engine.assetsFetcher.getTitleScreenSongLocation());
    engine.titleMngr.setCoordinates(330, -138, 330, 60, false);
    game.setMode("menu");

    let prevTime = Date.now();

    // This is the game loop
    function loop() {
        let currTime = Date.now();

        if ((currTime - prevTime) > game.framerate) {
            engine.gfxController.drawLayers();
            engine.gfxController.clearSpriteLayer();
    
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