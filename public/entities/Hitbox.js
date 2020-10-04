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
        
    }
}