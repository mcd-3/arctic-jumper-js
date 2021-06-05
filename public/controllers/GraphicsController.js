class GraphicsController {

    // Asset Fetcher
    #assetsFetcher;

    // Canvas Layers
    #bgl1;
    #bgl2;
    #fgl1;
    #fgl2;
    #dl;
    #hud1
    #hud2;
    #hud4;
    #hud5;

    constructor(assetsFetcher) {
        this.#assetsFetcher = assetsFetcher;

        // Initialize background/foreground layers
        this.#initBgl1(document.getElementById("bgl1"));
        this.#initBgl2(document.getElementById("bgl2"));
        this.#initFgl1(document.getElementById("fgl1"));
        this.#initFgl2(document.getElementById("fgl2"));
        this.#initDl(document.getElementById("dl"));
        this.#initScoreLayer(document.getElementById("hud1"));
        this.#initHealthLayer(document.getElementById("hud2"));
        this.#initHighscoreLayer(document.getElementById("hud4"))
        this.#initTextLayer(document.getElementById("hud5"));
    }

    /**
     * Draws layers to the screen
     */
    drawLayers() {
        this.#bgl1.draw();
        this.#bgl2.draw();
        this.#fgl1.draw();
    }

    /**
     * Stops layer movement
     */
    stopLayerMovements() {
        this.#bgl1.stop();
        this.#bgl2.stop();
        this.#fgl1.stop();
    }

    /**
     * Resumes layer movement
     */
    resumeLayerMovements() {
        this.#bgl1.resume();
        this.#bgl2.resume();
        this.#fgl1.resume();
    }

    /**
     * Unhides layers
     */
    showLayers() {
        this.#bgl1.show();
        this.#bgl2.show();
        this.#fgl1.show();
    }

    /**
     * Makes the death layer visible
     */
    showDeathLayer() {
        this.#dl.getContext("2d").clearRect(0, 0, this.#dl.width, this.#dl.height);
        this.#dl.getContext("2d").fillStyle = "rgba(30, 30, 30, 0.6)";
        this.#dl.getContext("2d").fillRect(0, 0, this.#dl.width, this.#dl.height);
    }

    /**
     * Hides the death layer
     */
    hideDeathLayer() {
        this.#dl.getContext("2d").clearRect(0, 0, this.#dl.width, this.#dl.height);
    }

    /**
     * Draws the amount of hp left on the Health HUD
     * 
     * @param {int} hp 
     */
    drawHealth(text, hp) {
        // Check which colour to use
        if (hp > 1) {
            this.#hud2.changeColor("#ffffff");
        } else if (hp > 0) {
            this.#hud2.changeColor("#ff0000");
        } else {
            this.#hud2.changeColor("#585858");
        }

        this.#hud2.setText(`${text} ${hp}`);
        this.#hud2.drawText();
    }

    /**
     * Draws the score on the Score HUD
     * 
     * @param {string} text
     * @param {int} score 
     */
    drawScore(text, score = -1) {
        score < 0 
            ? this.#hud1.setText(text)
            : this.#hud1.setText(`${text} ${score}`);
        this.#hud1.drawText();
    }

    /**
     * Draws the highscore on the Highscore HUD
     * 
     * @param {string} text
     * @param {int} hs
     */
    drawHighscore(text, hs = -1) {
        hs < 0 
            ? this.#hud4.setText(text)
            : this.#hud4.setText(`${text} ${hs}`);
        this.#hud4.drawText();
    }

    /**
     * Changes the size of the HS UI font
     */
    changeHighscoreUISize(size) {
        // 36
        this.#hud4.setUIText(new UIText({canvas: this.#hud4.canvas}, 18, 40, `${highScoreStr}}`, size, 1.15))
    }

    /**
     * Shows all the HUDs
     */
    showHUDs() {
        this.#hud1.display = "block";
        this.#hud2.display = "block";
        this.#hud4.display = "block";
    }

    /**
     * Shows the pause screen
     */
    showPauseScreen() {
        const textArray = [
            new UIText({canvas: this.#hud5.canvas}, 375, 60, pauseStr, 54, 1.15),
            new UIText({canvas: this.#hud5.canvas}, 375, 200, resumeGameStr, 28, 1.15),
            new UIText({canvas: this.#hud5.canvas}, 375, 280, gotoOptionsStr, 28, 1.15),
        ];
        this.#hud5.drawTexts(textArray);
    }

    /**
     * Shows the options screen
     */
    showOptionsScreen() {
        const textArray = [
            new UIText({canvas: this.#hud5.canvas}, 375, 60, optionsStr, 54, 1.15),
            new UIText({canvas: this.#hud5.canvas}, 268, 140, musicOptionStr, 32, 1.15),
            new UIText({canvas: this.#hud5.canvas}, 280, 220, sfxOptionStr, 32, 1.15),
            new UIText({canvas: this.#hud5.canvas}, 208, 300, resetHighscoreStr, 32, 1.15),
            new UIText({canvas: this.#hud5.canvas}, 375, 400, exitOptionsStr, 28, 1.15),
        ];
        this.#hud5.drawTexts(textArray);
    }

    /**
     * Shows the game over screen
     * 
     * @param {boolean} isGameOverTimerDone 
     * @param {boolean} isNewHighscore 
     * @param {int} score 
     */
    showGameOverScreen(isGameOverTimerDone, isNewHighscore, score) {
        const textArray = [
            new UIText({canvas: this.#hud5.canvas}, 375, 80, `${gameOverStr}`, 54, 1.15),
            new UIText({canvas: this.#hud5.canvas}, 375, 160, `${scoreStr} ${score}`, 54, 1.15),
        ];

        if (isGameOverTimerDone) {
            textArray.push(
                new UIText(
                    {canvas: this.#hud5.canvas},
                    375,
                    240,
                    `${resumeStr}`,
                    32,
                    1.15
                )
            );
        }

        if (isNewHighscore) {
            textArray.push(
                new UIText(
                    {canvas: this.#hud5.canvas},
                    375,
                    320,
                    `${newHighScoreStr}`,
                    48,
                    1.15,
                    "yellow"
                )
            );
        }

        this.#hud5.drawTexts(textArray);
    }

    /**
     * Clears the text layer
     */
    clearTextLayer() {
        this.#hud5.clear();
    }

    /**
     * Loads the foreground (the layer closest to the screen) into memory
     */
    #initFgl1(layer) {
        this.#fgl1 = new Background(
            {canvas: layer},
            0, 
            (540 - 154),
            1,
            0,
            9,
            layer.width,
            layer.height,
            this.#assetsFetcher.getFGL1ImageLocation()
        );
    }

    /**
     * Loads the sprite layer into memory
     */
    #initFgl2(layer) {
        this.#fgl2 = layer;
    }

    /**
     * Loads background layer 1 (the furthest back layer)
     */
    #initBgl1(layer) {
        this.#bgl1 = new Background(
            {canvas: layer},
            0,
            0,
            1,
            0,
            1,
            layer.width,
            layer.height,
            this.#assetsFetcher.getBGL1ImageLocation()
        );
    }

    /**
     * Loads background layer 2 (the middle layer) into memory
     */
    #initBgl2(layer) {
        this.#bgl2 = new Background(
            {canvas: layer},
            0,
            0,
            1,
            0,
            4,
            layer.width,
            layer.height, 
            this.#assetsFetcher.getBGL2ImageLocation()
        );
    }

    /**
     * Loads the death layer into memory
     */
    #initDl(layer) {
        this.#dl = layer;
    }

    /**
     * Loads the health HUD into memory
     */
    #initHealthLayer(layer) {
        const healthText = new UIText({canvas: layer}, 152, 40, `${healthStr}`, 36, 1.15);
        this.#hud2 = new HUD({canvas: layer}, healthText, true);
    }

    /**
     * Loads the score HUD into memory
     */
    #initScoreLayer(layer) {
        const scoreText = new UIText({canvas: layer}, 18, 40, optionsMenuStr, 36, 1.15);
        this.#hud1 = new HUD({canvas: layer}, scoreText, true);
    }

    /**
     * Loads the highscore HUD into memory
     */
    #initHighscoreLayer(layer) {
        const madeByText = new UIText({canvas: layer}, 18, 40, authorStr, 28, 1.15);
        this.#hud4 = new HUD({canvas: layer}, madeByText, true);
    }

    /**
     * Loads the pause/options/game-over screen into memory
     */
    #initTextLayer(layer) {
        this.#hud5 = new MultiHUD({canvas: layer}, true);
    }
}