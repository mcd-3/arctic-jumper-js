class PathStorageHelper {
    constructor() {
        this.assetPathLocation = "arcticJumperPathAsset";
        this.audioPathLocation = "arcticJumperPathAudio";
        this.imagePathLocation = "arcticJumperPathImage";
        this.fontPathLocation = "arcticJumperPathFont"
    }

    /**
     * Initialize where each directory is located
     */
    initPaths() {
        localStorage.setItem(this.assetPathLocation, "./assets/");
        localStorage.setItem(this.audioPathLocation, `./assets/audio/`);
        localStorage.setItem(this.imagePathLocation, `./assets/images/`)
    }

    /**
     * Get the path of the assets directory
     * 
     * @returns {string}
     */
    getAssetsLocation = () => localStorage.getItem(this.assetPathLocation);
    

    /**
     * Get the path of the audio directory
     * 
     * @returns {string}
     */
    getAudioLocation = () => localStorage.getItem(this.audioPathLocation);

    /**
     * Get the path of the image directory
     * 
     * @returns {string}
     */
    getImagesLocation = () => localStorage.getItem(this.imagePathLocation);
}