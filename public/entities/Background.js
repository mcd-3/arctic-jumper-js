class Background extends Entity {
    constructor(canvasObj, x, y, dx, dy, speed, imgW, imgH, imgName) {
        super(canvasObj, x, y);
        this.dx = dx;
        this.dy = dy;
        this.speed = speed;
        this.imgW = imgW;
        this.imgH = imgH;
        this.imgName = imgName;
        this.intervalSet = false;
    }

    /**
     * Draws a background on the screen
     */
    draw() {
        let img = new Image();
        img.onload = () => {
            if (!this.intervalSet) {
                setInterval(() => { 
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    // Prevent images from stopping to wrap
                    if (this.x > (this.canvas.width - 1)) {
                        this.x = 0;
                    }
                    if (this.x > 0) {
                        this.ctx.drawImage(img, -this.imgW + this.x, this.y, this.imgW, this.imgH);
                    }
                    // draw additional image on the side (wrap illusion)
                    if (this.x - this.imgW > 0) {
                        this.ctx.drawImage(img, -this.imgW * 2 + this.x, this.y, this.imgW, this.imgH);
                    }
                    this.ctx.drawImage(img, this.x, this.y, this.imgW, this.imgH);
                    
                    this.x += this.dx;
                    this.intervalSet = true;
                },
                this.speed
                )
            };
        }
        img.src = `assets/images/${this.imgName}`;
    }
}