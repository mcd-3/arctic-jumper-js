class UIText extends Entity {
    constructor(canvasObj, x, y, text, size, strokeSize) {
        super(canvasObj, x, y);
        this.text = text;
        this.size = size;
        this.strokeSize = strokeSize;
    }

    draw() {
        this.ctx.font = `${this.size}px dpcomic`;
        this.ctx.fillStyle = "#ffffff";
        this.ctx.strokeStyle = "#000000";
        this.ctx.fillText(this.text, this.x, this.y);
        this.ctx.lineWidth = this.strokeSize;
        this.ctx.strokeText(this.text, this.x, this.y);
    }
}