/**
 * coldwindEntry.js
 * 
 * Entry point for the Coldwind engine, Game logic, and the controls
 */
const engine = new Coldwind();
const game = new Game(
    document.getElementById("bgl1"),
    document.getElementById("fgl2")
);
new ControlsController(game);

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