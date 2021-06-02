class DeleteButton {
    constructor(id) {
        this.button = document.getElementById(id);
    }

    /**
     * Shows the button on screen
     */
    show() {
        this.button.style.visibility = "visible";
    }

    /**
     * Hides the button from view
     */
    hide() {
        this.button.style.visibility = "hidden";
    }

    /**
     * Unfocuses a button so you may not click with "Enter"
     */
    unfocus() {
        this.button.blur();
    }

    /**
     *  Adds an onclick listener to listen to 
     *
     * @param {EventListener} onclickListener 
     */
    addOnClickListener(onclickListener) {
        this.button.addEventListener("click", onclickListener);
    }

}