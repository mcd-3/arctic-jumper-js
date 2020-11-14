class UIText extends Entity {
    constructor(canvasObj, x, y, text, size, strokeSize, color = "#ffffff") {
        super(canvasObj, x, y);
        this.text = text;
        this.size = size;
        this.strokeSize = strokeSize;
        this.color = color;
    }

    /**
     * Draws the text to screen
     */
    draw(isCentered = false) {
        this.ctx.font = `${this.size}px dpcomic`;
        this.ctx.fillStyle = this.color
        this.ctx.strokeStyle = "#000000";

        if (isCentered) {
            this.ctx.textAlign = "center";
        }

        this.ctx.fillText(this.text, this.x, this.y);
        this.ctx.lineWidth = this.strokeSize;
        this.ctx.strokeText(this.text, this.x, this.y);
    }

    /**
     * Changes the color of the text
     * 
     * @param {string} color 
     */
    setColor(color) {
        this.color = color;
    }

    /**
     * Sets the text to show
     * 
     * @param {string} str 
     */
    setText(str) {
        this.text = str;
    }
}