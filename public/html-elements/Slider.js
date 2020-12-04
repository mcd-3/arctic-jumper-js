class Slider {
    constructor(id) {
        this.slider = document.getElementById(id);
    }

    /**
     * Shows the slider on screen
     */
    show() {
        this.slider.style.visibility = "visible";
    }

    /**
     * Hides the slider from view
     */
    hide() {
        this.slider.style.visibility = "hidden";
    }

    /**
     * Executes a callback function when the slider's value is changed
     * 
     * @param {Callback} callback 
     */
    update(callback) {

    }
}