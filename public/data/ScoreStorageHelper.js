class ScoreStorageHelper {
    constructor() {
        this.highScoreLocation = "arcticJumperHighScore";
        this.highScore = localStorage.getItem(this.highScoreLocation);
        this.minHS = 0;
    }

    /**
     * Saves a new high score to local storage
     * 
     * @param {int} score 
     */
    addHighScore(score) {
        if (score > this.getHighScore()) {
            this.deleteHighScore();
            localStorage.setItem(this.highScoreLocation, score);
            this.highScore = score;
        }
    }

    /**
     * Retrieves the currently saved high score
     */
    getHighScore() {
        if (this.highScore == null) {
            localStorage.setItem(this.highScoreLocation, this.minHS);
            this.highScore = this.minHS;
        }
        return this.highScore;
    }

    /**
     * Deletes the currently saved high score
     */
    deleteHighScore() {
        localStorage.setItem(this.highScoreLocation, this.minHS);
        this.highScore = this.minHS;
    }
}