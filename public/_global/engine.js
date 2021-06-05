/**
 * engine.js
 * 
 * Creates global variables for audio, graphics, and text
 * Engine name is Coldwind
 */
class Coldwind {
    constructor() {
        this.gfxController = new GraphicsController();
        this.audioController = new AudioController();
    }
}