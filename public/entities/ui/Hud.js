class HUD {
    constructor(canvasObj, uiText, displayed) {
        let scaler = new CanvasDPIHelper();
        this.canvas = canvasObj.canvas;
        this.ctx = scaler.scale(this.canvas);//canvasObj.canvas.getContext("2d");
        this.uiText = uiText;
        this.displayed = displayed;
    }

    /**
     * Draws the text to the canvas
     */
    drawText() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.uiText.draw();
    }

    /**
     * Changes the text displayed on the HUD
     * 
     * @param {string} str 
     */
    setText(str) {
        this.uiText.setText(str);
    }
}