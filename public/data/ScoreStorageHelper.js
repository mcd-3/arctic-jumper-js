class ScoreStorageHelper {

    #highScoreLocation;
    #highScore;
    #minHS;
    #cachedScore;
    #cachedHS;

    constructor() {
        this.#highScoreLocation = "arcticJumperHighScore";
        this.#highScore = localStorage.getItem(this.#highScoreLocation);
        this.#minHS = 0;
        this.#cachedScore = 0;
        this.#cachedHS = this.#highScore;
    }

    /**
     * Saves a new high score to local storage
     * 
     * @param {int} score 
     */
    addHighScore(score) {
        if (score > this.getHighScore()) {
            this.deleteHighScore();
            localStorage.setItem(this.#highScoreLocation, score);
            this.#highScore = score;
        }
    }

    /**
     * Retrieves the currently saved high score from local storage
     */
    getHighScore() {
        if (this.#highScore == null) {
            localStorage.setItem(this.#highScoreLocation, this.#minHS);
            this.#highScore = this.#minHS;
        }
        return this.#highScore;
    }

    /**
     * Deletes the currently saved high score from local storage
     */
    deleteHighScore() {
        localStorage.setItem(this.#highScoreLocation, this.#minHS);
        this.#highScore = this.#minHS;
    }

    getCachedScore() {
        return this.#cachedScore;
    }

    getCachedHighscore() {
        return this.#cachedHS;
    }

    setCachedScore(score) {
        this.#cachedScore = score;
    }

    setCachedHighscore(hs) {
        this.#cachedHS = hs;
    }

    incrementCachedScore() {
        this.#cachedScore++;
    }

}