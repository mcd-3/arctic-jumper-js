/**
 * engine.js
 * 
 * Creates global variables for audio, graphics, and assets
 * Engine name is Coldwind
 */
class Coldwind {
    constructor() {
        this.assetsFetcher = new AssetLocationFetcher();
        this.storage = new ScoreStorageHelper();
        this.gfxController = new GraphicsController(this.assetsFetcher);
        this.audioController = new AudioController();
        this.flagController = new FlagController();
        this.enemyMngr = new EnemyManager();
        this.playerMngr = new PlayerManager(this.assetsFetcher);
        this.titleMngr = new TitleCardManager(this.assetsFetcher);
    }
}