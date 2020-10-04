class Hitbox {

    /**
     * @param {int} ul UpperLeft 
     * @param {int} ur UpperRight
     * @param {int} bl BottomLeft
     * @param {int} br BottomRight
     */
    constructor(ul, ur, bl, br) {
       this.ul = ul;
       this.ur = ur;
       this.bl = bl;
       this.br = br; 
    }

    /**
     * Updates the position of the hitbox
     * 
     * @param {int} ul UpperLeft 
     * @param {int} ur UpperRight
     * @param {int} bl BottomLeft
     * @param {int} br BottomRight
     */
    updatePos(ul, ur, bl, br) {
        this.ul = ul;
        this.ur = ur;
        this.bl = bl;
        this.br = br; 
    }

    /**
     * Checks to see if two hitboxes are overlapping
     * 
     * @param {Hitbox} otherHitbox 
     */
    isOverlapping(otherHitbox) {
        let isOvrlp = false;

        if ((this.bl <= otherHitbox.ul) && (
            (this.bl >= otherHitbox.bl && this.bl <= otherHitbox.br) ||
            (this.br >= otherHitbox.bl && this.br <= otherHitbox.br)
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
        ctx.fillRect(ul, br, (ur - ul), (br - bl));
    }
}