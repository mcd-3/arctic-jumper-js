class TitleCardManager {

    #titleCard;

    constructor(assetsFetcher) {
        this.#titleCard = new TitleCard(
            {canvas: document.getElementById("fgl2")},
            0,
            0,
            256,
            128,
            assetsFetcher.getTitleImageLocation()
        );
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
        this.#titleCard.setCoordinates(
            fromX,
            fromY,
            toX,
            toY,
            eraseOnDestination
        );
    }

    /**
     * Draws the title card
     */
    draw() {
        this.#titleCard.draw();
    }

    /**
     * Stops moving the title card
     */
    stop() {
        this.#titleCard.stop();
    }

    /**
     * Resumes moving the title card from a stopped state
     */
    resume() {
        this.#titleCard.resume();
    }

    /**
     * Checks if the title card is finished drawing to screen
     * 
     * @returns {boolean}
     */
    isDoneDrawing() {
        return this.#titleCard.isDoneDrawing;
    }
}