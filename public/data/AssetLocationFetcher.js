class AssetLocationFetcher {
    constructor() {
        this.paths = new PathStorageHelper();

        // Audio
        this.startSfx = "magicIdea01.mp3";
        this.bootSfx = "logo_short.mp3";
        this.scoreSfx = "collect.mp3";
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
    getStartGameSFXLocation = () => `${this.paths.getAudioLocation()}${this.startSfx}`;

    /**
     * Get the "boot game" sound effect location
     * 
     * @returns {string}
     */
    getBootGameSFXLocation = () => `${this.paths.getAudioLocation()}${this.bootSfx}`;

    /**
     * Get the "score" sound effect location
     * 
     * @returns {string}
     */
    getScoreSFXLocation = () => `${this.paths.getAudioLocation()}${this.scoreSfx}`;

    /**
     * Get the "hit" sound effect location
     * 
     * @returns {string}
     */
    getHitSFXLocation = () => `${this.paths.getAudioLocation()}${this.hitSfx}`;

    /**
     * Get the "game over" sound effect location
     * 
     * @returns {string}
     */
    getGameOverSFXLocation = () => `${this.paths.getAudioLocation()}${this.gameOverSfx}`;

    /**
     * Get the "title screen" song location
     * 
     * @returns {string}
     */
    getTitleScreenSongLocation = () => `${this.paths.getAudioLocation()}${this.titleScreenSong}`;

    /**
     * Get the "main" song location
     * 
     * @returns {string}
     */
    getMainSongLocation = () => `${this.paths.getAudioLocation()}${this.mainSong}`;

    /**
     * Get the "bgl1" image location
     * 
     * @returns {string}
     */
    getBGL1ImageLocation = () => `${this.paths.getImagesLocation()}${this.bgl1Img}`;

    /**
     * Get the "bgl2" image location
     * 
     * @returns {string}
     */
    getBGL2ImageLocation = () => `${this.paths.getImagesLocation()}${this.bgl2Img}`;

    /**
     * Get the "fgl1" image location
     * 
     * @returns {string}
     */
    getFGL1ImageLocation = () => `${this.paths.getImagesLocation()}${this.fgl1Img}`;

    /**
     * Get the "boot" image location
     * 
     * @returns {string}
     */
    getBootImageLocation = () => `${this.paths.getImagesLocation()}${this.bootImg}`;

    /**
     * Get the "title" image location
     * 
     * @returns {string}
     */
    getTitleImageLocation = () => `${this.paths.getImagesLocation()}${this.titleImg}`;

    /**
     * Get the "player" image location
     * 
     * @returns {string}
     */
    getPlayerImageLocation = () => `${this.paths.getImagesLocation()}${this.playerImg}`;

    /**
     * Get the "penguin" image location
     * 
     * @returns {string}
     */
    getPenguinImageLocation = () => `${this.paths.getImagesLocation()}${this.penguinImg}`;

    /**
     * Get the "rock" image location
     * 
     * @returns {string}
     */
    getRockImageLocation = () => `${this.paths.getImagesLocation()}${this.rockImg}`;

    /**
     * Get the "snowman" image location
     * 
     * @returns {string}
     */
    getSnowmanImageLocation = () => `${this.paths.getImagesLocation()}${this.snowmanImg}`;

    /**
     * Get the "dpcomic" font location
     * 
     * @returns {string}
     */
    getDPComicFontName = () => this.dpcomic;
}