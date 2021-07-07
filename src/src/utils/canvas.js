const roundedRect = (c, x, y, w, h, radius, color='black') => {
    c.beginPath();

    const fillStyle = c.fillStyle;
    c.fillStyle = color;

    c.moveTo(x,y);
    c.arcTo(x+w,y,x+w,y+h,radius);
    c.arcTo(x+w,y+h,x,y+h,radius);
    c.arcTo(x,y+h,x,y,radius);
    c.arcTo(x,y,x+w,y,radius);

    c.fill();
    c.fillStyle = fillStyle;
}

export { roundedRect };