class TitleCard extends Entity {
    constructor(canvasObj, x, y, imgW, imgH, imgPath) {
        super(canvasObj, x, y);
        this.imgW = imgW;
        this.imgH = imgH;
        this.imgPath = imgPath;
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
        this.isStopped = false;
        this.img = null;
        this.imageLoaded = false;

        this.initImage();
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
        if (this.imageLoaded && this.coordinatesSet) {
            if (this.currentX != this.toX || this.currentY != this.toY) {
                engine.gfxController.drawSpriteAsset(
                    this.img,
                    this.currentX,
                    this.currentY
                );
                if (!this.isStopped) {
                    if (this.currentX != this.toX) {
                        this.currentX += this.dx;
                    }
                    if (this.currentY != this.toY) {
                        this.currentY += this.dy;
                    }
                }
            } else {
                this.isDoneDrawing = true;
                if (!this.eraseOnDestination) {
                    engine.gfxController.drawSpriteAsset(
                        this.img,
                        this.currentX,
                        this.currentY
                    );
                }
            }
        }
    }

    /**
     * Handles moving and drawing image to screen
     * 
     * @param {Image} img 
     */
    onImageLoaded() {
        this.imageLoaded = true;
    }

    /**
     * Initializes the image
     */
    initImage() {
        this.img = new Image();
        this.img.src = this.imgPath;
        this.img.onload = this.onImageLoaded();
    }

    /**
     * Stops moving the title card
     */
    stop() {
        this.isStopped = true;
    }

    /**
     * Resumes moving the title card
     */
    resume() {
        this.isStopped = false;
    }
}