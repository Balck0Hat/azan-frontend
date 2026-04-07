class StarsPainter {
    paint(ctx, geom, props) {
        const count = parseInt(props.get('--star-count')) || 30;
        const sizeMin = parseInt(props.get('--star-size-min')) || 1;
        const sizeMax = parseInt(props.get('--star-size-max')) || 3;

        for (let i = 0; i < count; i++) {
            const x = Math.random() * geom.width;
            const y = Math.random() * geom.height;
            const size = sizeMin + Math.random() * (sizeMax - sizeMin);

            ctx.fillStyle = `rgba(255,255,255,${0.4 + Math.random() * 0.6})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

registerPaint('stars', StarsPainter);
