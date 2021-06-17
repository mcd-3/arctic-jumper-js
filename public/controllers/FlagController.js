class FlagController {
    
    #flags;
    
    constructor() {
        this.#flags = {
            bootComplete: false,
            titleDone: false,
            gameStarting: false,
            newHighScore: false,
            gameOverTimerDone: false,
            isOptions: false,
            isPaused: false,
        }
    }

    /**
     * Gets the value of a flag
     * 
     * @param {string} flag 
     * @returns {boolean}
     */
    getFlag(flag) {
        return this.#flags[flag];
    }

    /**
     * Sets a flag variable
     * 
     * @param {string} flag 
     * @param {boolean} val 
     */
    setFlag(flag, val = true) {
        this.#flags[flag] = val;
    }
}