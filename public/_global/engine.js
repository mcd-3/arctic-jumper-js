/**
 * engine.js
 * 
 * Creates global variables for audio, graphics, and assets
 * Engine name is Coldwind
 */
class Coldwind {
    constructor() {
        this.assetsFetcher = new AssetLocationFetcher();
        this.gfxController = new GraphicsController(this.assetsFetcher);
        this.audioController = new AudioController();
    }
}