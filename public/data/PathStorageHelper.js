class PathStorageHelper {

    /**
     * Initialize where each directory is located
     */
    static initPaths() {
        this.assetPathLocation = "arcticJumperPathAsset";
        this.audioPathLocation = "arcticJumperPathAudio";
        this.imagePathLocation = "arcticJumperPathImage";
        this.fontPathLocation = "arcticJumperPathFont";

        localStorage.setItem(this.assetPathLocation, "./assets/");
        localStorage.setItem(this.audioPathLocation, `./assets/audio/`);
        localStorage.setItem(this.imagePathLocation, `./assets/images/`)
    }

    /**
     * Get the path of the assets directory
     * 
     * @returns {string}
     */
    static getAssetsLocation = () => localStorage.getItem(this.assetPathLocation);
    

    /**
     * Get the path of the audio directory
     * 
     * @returns {string}
     */
    static getAudioLocation = () => localStorage.getItem(this.audioPathLocation);

    /**
     * Get the path of the image directory
     * 
     * @returns {string}
     */
    static getImagesLocation = () => localStorage.getItem(this.imagePathLocation);
}