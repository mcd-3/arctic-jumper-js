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
    #hud3;
    #hud4;
    #hud5;

    constructor() {
        this.#assetsFetcher = new AssetLocationFetcher();

        // Initialize background/foreground layers
        this.#initBgl1(document.getElementById("bgl1"));
        this.#initBgl2(document.getElementById("bgl2"));
        this.#initFgl1(document.getElementById("fgl1"));
        this.#initFgl2(document.getElementById("fgl2"));
        
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
}