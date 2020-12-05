class VolumeSettings {
    constructor() {
        this.musicVolumeLocation = "arcticJumperMusicVolume";
        this.sfxVolumeLocation = "arcticJumperSFXVolume";
        this.minMusicVolume = 0.5;
        this.minSFXVolume = 0.5;
        this.musicVolume = localStorage.getItem(this.musicVolumeLocation);
        this.sfxVolume = localStorage.getItem(this.sfxVolumeLocation);
    }

    /**
     * Gets the music volume settings saved in localstorage
     * 
     * @returns {double}
     */
    getUserMusicVolume() {
        if (this.musicVolume == null) {
            localStorage.setItem(this.musicVolumeLocation, this.minMusicVolume);
            this.musicVolume = this.minMusicVolume;
        }
        return this.musicVolume;
    }

    /**
     * Gets the sfx volume settings saved in localstorage
     * 
     * @returns {double}
     */
    getUserSFXVolume() {
        if (this.sfxVolume == null) {
            localStorage.setItem(this.sfxVolumeLocation, this.minSFXVolume);
            this.sfxVolume = this.minSFXVolume;
        }
        return this.sfxVolume;
    }

    /**
     * Sets the music volume
     * 
     * @param {double} vol 
     */
    setUserMusicVolume(vol) {
        this.musicVolume = vol;
    }

    /**
     * Sets the sfx volume
     * 
     * @param {double} vol 
     */
    setUserSFXVolume(vol) {
        this.sfxVolume = vol;
    }

    /**
     * Saves the user music volume setting to localstorage
     */
    async saveUserMusicVolume() {
        localStorage.setItem(this.musicVolumeLocation, this.musicVolume);
    }

    /**
     * Saves the user sfx volume setting to localstorage
     */
    async saveUserSFXVolume() {
        localStorage.setItem(this.sfxVolumeLocation, this.sfxVolumeLocation);
    }
}