class TitleCard extends Entity {
    constructor(canvasObj, x, y, imgW, imgH, imgName) {
        super(canvasObj, x, y);
        this.imgW = imgW;
        this.imgH = imgH;
        this.imgName = imgName;
        this.coordinatesSet = false;
        this.fromX = 0;
        this.fromY = 0;
        this.toX = 0;
        this.toY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.dx = 1;
        this.dy = 1;
        this.eraseOnDestination = true;
        this.isDoneDrawing = true;
    }

    /**
     * Set the coordinates so the image can move from point A to point B
     * 
     * @param {int} fromX 
     * @param {int} fromY 
     * @param {int} toX 
     * @param {int} toY 
     * @param {boolean} eraseOnDestination 
     */
    setCoordinates(fromX, fromY, toX, toY, eraseOnDestination) {
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
        this.currentX = fromX;
        this.currentY = fromY;
        this.coordinatesSet = true;
        this.dx = (fromX < toX) ? 2 : -2;
        this.dy = (fromY < toY) ? 2 : -2;
        this.eraseOnDestination = eraseOnDestination;
        this.isDoneDrawing = false;
    }

    /**
     * Draws the image to screen
     */
    draw() {
        if (this.coordinatesSet) {
            let img = new Image();
            img.src = `assets/images/${this.imgName}`;
            img.onload = this.onImageLoaded(img);
        }
    }

    /**
     * Handles moving and drawing image to screen
     * 
     * @param {Image} img 
     */
    onImageLoaded(img) {
        if (this.currentX != this.toX || this.currentY != this.toY) {
            this.ctx.drawImage(img, this.currentX, this.currentY);

            if (this.currentX != this.toX) {
                this.currentX += this.dx;
            }
            if (this.currentY != this.toY) {
                this.currentY += this.dy;
            }
        } else {
            this.isDoneDrawing = true;
            if (!this.eraseOnDestination) {
                this.ctx.drawImage(img, this.currentX, this.currentY);
            }
        }
    }
}