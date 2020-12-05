class Slider {
    constructor(id) {
        this.slider = document.getElementById(id);
    }

    setValue(val) {
        this.slider.value = val;
    }

    getValue = () => this.slider.value;
    

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
     * Adds oninput and onchange listeners to the sliders,
     * and executes callbacks when these are triggered
     * 
     * @param {Callback} oninputCallback 
     * @param {Callback} onchangeCallback 
     */
    addUpdateListeners(oninputCallback, onchangeCallback) {
        this.slider.addEventListener("input", oninputCallback);
        this.slider.addEventListener("change", onchangeCallback);
    }
}