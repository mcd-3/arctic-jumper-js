class Hitbox {

    /**
     * @param {int} u Up Y
     * @param {int} d Down Y
     * @param {int} l Left X
     * @param {int} r Right X
     */
    constructor(u, d, l, r) {
       this.u = u;
       this.d = d;
       this.l = l;
       this.r = r; 
    }

    /**
     * Updates the position of the hitbox
     * 
     * @param {int} u Up Y
     * @param {int} d Down Y
     * @param {int} l Left X
     * @param {int} r Right X
     */
    updatePos(u, d, l, r) {
        this.u = u;
        this.d = d;
        this.l = l;
        this.r = r; 
     }

    /**
     * Checks to see if two hitboxes are overlapping
     * FIXME: Might be bugged...
     * 
     * @param {Hitbox} otherHitbox 
     */
    isOverlapping(otherHitbox) {
        let isOvrlp = false;

        if ((this.d <= otherHitbox.u) && (
            (this.l >= otherHitbox.l && this.l <= otherHitbox.r) ||
            (this.r >= otherHitbox.l && this.r <= otherHitbox.r)
        )) {
            isOvrlp = true;
        }

        return isOvrlp;
    }

    /**
     * Draws a hitbox to the specified canvas.
     * This is a debug function: it should not be used other than for tests
     * 
     * @param {CanvasRenderingContext2D} ctx
     */
    debugDrawHitbox(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.l, this.d, (this.r - this.l), (this.u - this.d));
    }
}