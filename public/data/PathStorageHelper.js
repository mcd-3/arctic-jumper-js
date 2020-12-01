class PathStorageHelper {
    constructor() {
        this.assetPathLocation = "arcticJumperPathAsset";
        this.audioPathLocation = "arcticJumperPathAudio";
        this.imagePathLocation = "arcticJumperPathImage";
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
    getAssetsLocation() {
        return localStorage.getItem(this.assetPathLocation);
    }

    /**
     * Get the path of the audio directory
     * 
     * @returns {string}
     */
    getAudioLocation() {
        return localStorage.getItem(this.audioPathLocation);
    }

    /**
     * Get the path of the image directory
     * 
     * @returns {string}
     */
    getImagesLocation() {
        return localStorage.getItem(this.imagePathLocation);
    }
}