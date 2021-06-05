class AssetLocationFetcher {
    constructor() {
        // Init the localstorage paths
        PathStorageHelper.initPaths();

        // Audio
        this.startSfx = "magicIdea01.mp3";
        this.bootSfx = "logo_short.mp3";
        this.scoreSfx = "collect.mp3";
        this.jumpSfx = "jump.wav";
        this.hitSfx = "hit.mp3";
        this.gameOverSfx = "failBuzzer.mp3";
        this.titleScreenSong = "steviaSphere_Dolphin.mp3";
        this.mainSong = "steviaSphere_PolarBears.mp3";

        // Images
        this.bgl1Img = "bgl1.png";
        this.bgl2Img = "bgl2.png";
        this.fgl1Img = "fgl1.png";
        this.bootImg = "boot.png";
        this.titleImg = "title.png";
        this.playerImg = "player-fat.png";
        this.penguinImg = "penguin.png";
        this.rockImg = "rock.png";
        this.snowmanImg = "snowman.png";

        // Fonts
        this.dpcomic = "dpcomic";
    }

    /**
     * Get the "start game" sound effect location
     * 
     * @returns {string}
     */
    getStartGameSFXLocation = () => `${PathStorageHelper.getAudioLocation()}${this.startSfx}`;

    /**
     * Get the "boot game" sound effect location
     * 
     * @returns {string}
     */
    getBootGameSFXLocation = () => `${PathStorageHelper.getAudioLocation()}${this.bootSfx}`;

    /**
     * Get the "score" sound effect location
     * 
     * @returns {string}
     */
    getScoreSFXLocation = () => `${PathStorageHelper.getAudioLocation()}${this.scoreSfx}`;

    /**
     * Get the "jump" sound effect location
     * 
     * @returns {string}
     */
    getJumpSFXLocation = () => `${PathStorageHelper.getAudioLocation()}${this.jumpSfx}`;

    /**
     * Get the "hit" sound effect location
     * 
     * @returns {string}
     */
    getHitSFXLocation = () => `${PathStorageHelper.getAudioLocation()}${this.hitSfx}`;

    /**
     * Get the "game over" sound effect location
     * 
     * @returns {string}
     */
    getGameOverSFXLocation = () => `${PathStorageHelper.getAudioLocation()}${this.gameOverSfx}`;

    /**
     * Get the "title screen" song location
     * 
     * @returns {string}
     */
    getTitleScreenSongLocation = () => `${PathStorageHelper.getAudioLocation()}${this.titleScreenSong}`;

    /**
     * Get the "main" song location
     * 
     * @returns {string}
     */
    getMainSongLocation = () => `${PathStorageHelper.getAudioLocation()}${this.mainSong}`;

    /**
     * Get the "bgl1" image location
     * 
     * @returns {string}
     */
    getBGL1ImageLocation = () => `${PathStorageHelper.getImagesLocation()}${this.bgl1Img}`;

    /**
     * Get the "bgl2" image location
     * 
     * @returns {string}
     */
    getBGL2ImageLocation = () => `${PathStorageHelper.getImagesLocation()}${this.bgl2Img}`;

    /**
     * Get the "fgl1" image location
     * 
     * @returns {string}
     */
    getFGL1ImageLocation = () => `${PathStorageHelper.getImagesLocation()}${this.fgl1Img}`;

    /**
     * Get the "boot" image location
     * 
     * @returns {string}
     */
    getBootImageLocation = () => `${PathStorageHelper.getImagesLocation()}${this.bootImg}`;

    /**
     * Get the "title" image location
     * 
     * @returns {string}
     */
    getTitleImageLocation = () => `${PathStorageHelper.getImagesLocation()}${this.titleImg}`;

    /**
     * Get the "player" image location
     * 
     * @returns {string}
     */
    getPlayerImageLocation = () => `${PathStorageHelper.getImagesLocation()}${this.playerImg}`;

    /**
     * Get the "penguin" image location
     * 
     * @returns {string}
     */
    getPenguinImageLocation = () => `${PathStorageHelper.getImagesLocation()}${this.penguinImg}`;

    /**
     * Get the "rock" image location
     * 
     * @returns {string}
     */
    getRockImageLocation = () => `${PathStorageHelper.getImagesLocation()}${this.rockImg}`;

    /**
     * Get the "snowman" image location
     * 
     * @returns {string}
     */
    getSnowmanImageLocation = () => `${PathStorageHelper.getImagesLocation()}${this.snowmanImg}`;

    /**
     * Get the "dpcomic" font location
     * 
     * @returns {string}
     */
    getDPComicFontName = () => this.dpcomic;
}