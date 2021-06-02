class AudioController {

    #playingTrack;
    #volumeSettings;

    constructor() {
        this.#playingTrack = null;
        this.#volumeSettings = new VolumeSettings();
    }

    /**
     * Play a music track. Not to be used for SFX
     * 
     * @param {string} track 
     * @param {boolean} isLoop 
     */
    playTrack(track, isLoop = true) {
        if (this.playingTrack != null) {
            this.stopTrack();
        }
        this.#playingTrack = new Audio(track);
        this.#playingTrack.loop = isLoop;
        this.#playingTrack.volume = this.#volumeSettings.getUserMusicVolume();
        this.#playingTrack.play();
    }

    /**
     * Plays a sound effect. Not to be used for music tracks
     * 
     * @param {string} sfx 
     * @param {float} volume 
     * @returns {Audio}
     */
    playSFX(sfx) {
        let gameSfx = new Audio(sfx);
        gameSfx.volume = this.#volumeSettings.getUserSFXVolume();
        gameSfx.play();
        return gameSfx;
    }

    /**
     * Stops a music track if it is playing
     */
    stopTrack() {
        if (this.#playingTrack != null) {
            this.#playingTrack.pause();
            this.#playingTrack.currentTime = 0;
            this.#playingTrack = null;
        }
    }

    /**
     * Updates the music volume settings
     * 
     * @param {int} volume 
     */
    updateMusicVolume(volume) {
        this.#volumeSettings.setUserMusicVolume(volume);
        this.#playingTrack.volume = volume;
        this.#volumeSettings.saveUserMusicVolume();
    }

    /**
     * Updates the sfx volume settings
     * 
     * @param {int} volume 
     */
    updateSFXVolume(volume) {
        this.#volumeSettings.setUserSFXVolume(volume);
        this.#volumeSettings.saveUserSFXVolume();
    }

    /**
     * Gets the saved music volume setting
     * 
     * @returns {double}
     */
    getMusicVolume() {
        return this.#volumeSettings.getUserMusicVolume();
    }

    /**
     * Gets the saved sfx volume setting
     * 
     * @returns {double}
     */
    getSFXVolume() {
        return this.#volumeSettings.getUserSFXVolume();
    }
}