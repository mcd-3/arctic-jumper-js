class CanvasDPIHelper {
    constructor() {}

    scale(canvas) {
        let dpr = window.devicePixelRatio || 1;
        let rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        var ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        return ctx;
    }
}