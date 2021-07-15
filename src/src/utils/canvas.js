const roundedRect = (c, x, y, w, h, radius, color = 'black') => {
    c.save();
    c.beginPath();

    const fillStyle = c.fillStyle;
    c.fillStyle = color;

    c.moveTo(x, y);
    c.arcTo(x + w, y, x + w, y + h, radius);
    c.arcTo(x + w, y + h, x, y + h, radius);
    c.arcTo(x, y + h, x, y, radius);
    c.arcTo(x, y, x + w, y, radius);

    c.fill();
    c.fillStyle = fillStyle;
    c.restore();
}

const arrow = (c, fromx, fromy, tox, toy, lineWidth = 2.5, headlen = 15) => {

    c.save();

    c.beginPath();

    c.lineWidth = lineWidth;

    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);

    c.moveTo(fromx, fromy);
    c.lineTo(
        tox-headlen*Math.cos(angle)*Math.sqrt(3)/2, 
        toy-headlen*Math.sin(angle)*Math.sqrt(3)/2
        );

    c.stroke();

    c.beginPath();

    c.moveTo(tox, toy);
    c.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    c.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    c.lineTo(tox, toy);

    c.fill();

    c.restore();

}

export { roundedRect, arrow };
