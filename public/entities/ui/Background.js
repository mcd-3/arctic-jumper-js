class Background extends Entity {
    constructor(canvasObj, x, y, dx, dy, speed, imgW, imgH, imgPath) {
        super(canvasObj, x, y);
        let scaler = new CanvasDPIHelper();
        this.ctx = scaler.scale(this.canvas);
        this.dx = dx;
        this.dy = dy;
        this.speed = speed;
        this.img = null;
        this.imgW = imgW;
        this.imgH = imgH;
        this.imgPath = imgPath;
        this.intervalSet = false;
        this.isStopped = false;
        this.imageLoaded = true;

        this.initImage();
    }

    /**
     * Draws a background on the screen
     */
    draw() {
        if (this.imageLoaded) {
            if (!this.isStopped) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                // Prevent images from stopping to wrap
                if (this.x > (this.canvas.width - 1)) {
                    this.x = 0;
                }
                if (this.x > 0) {
                    this.ctx.drawImage(this.img, -this.imgW + this.x, this.y, this.imgW, this.imgH);
                }
                // draw additional image on the side (wrap illusion)
                if (this.x - this.imgW > 0) {
                    this.ctx.drawImage(this.img, -this.imgW * 2 + this.x, this.y, this.imgW, this.imgH);
                }
                this.ctx.drawImage(this.img, this.x, this.y, this.imgW, this.imgH);
                

                this.x += this.dx;
                this.x += this.speed;
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
     * Stop background scrolling
     */
    stop() {
        this.isStopped = true;
    }

    /**
     * Resume background scrolling
     */
    resume() {
        this.isStopped = false;
    }
}