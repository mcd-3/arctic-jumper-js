class ControlsController {

    #spaceBarKeyCode;
    #enterKeyCode;

    constructor(game) {
        this.#spaceBarKeyCode = "Space";
        this.#enterKeyCode = "Enter";

        // Event for pressing space
        document.addEventListener('keydown', (e) => {
            if (e.code == this.#spaceBarKeyCode) {
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
            } else if (e.code == this.#enterKeyCode) {
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
    }
}