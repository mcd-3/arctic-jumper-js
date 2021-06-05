class MultiHUD {
    constructor(canvasObj, displayed) {
        let scaler = new CanvasDPIHelper();
        this.canvas = canvasObj.canvas;
        this.ctx = scaler.scaleText(this.canvas);
        this.displayed = displayed;
    }

    /**
     * Draws the texts to the canvas
     */
    drawTexts(uiTextArray) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        uiTextArray.forEach( str => {
            str.draw(true);
        });
    }

    /**
     * Clears the canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}