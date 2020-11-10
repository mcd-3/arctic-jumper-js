class MultiHUD {
    constructor(canvasObj, displayed) {
        this.canvas = canvasObj.canvas;
        this.ctx = canvasObj.canvas.getContext("2d");
        this.displayed = displayed;
    }

    /**
     * Draws the texts to the canvas
     */
    drawTexts(uiTextArray) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        uiTextArray.forEach( str => {
            str.draw();
        });
    }

    /**
     * Clears the canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}