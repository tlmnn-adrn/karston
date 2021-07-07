import React, { useRef, useEffect, useContext, useState } from 'react';

import { CompilerContext } from '../../context';

const Diagram = ({ data }) => {

    const canvasRef = useRef(null);

    const [context, setContext] = useContext(CompilerContext);

    const [mousePos, setMousePos] = useState(0);

    useEffect(() => {

        const canvas = canvasRef.current;
        const c = canvas.getContext('2d');

        const width = canvas.width;
        const height = canvas.height;

        const filteredData = Object.keys(data)
                                    .reduce( (accumulator, key) => (context.yAxis[key] && (accumulator[key] = data[key]) , accumulator), {});

        const dataLength = Object.entries(filteredData).length ? filteredData[Object.keys(filteredData)[0]].length : 0;

        const xAxis = context.xAxis && Object.keys(context.initialVars).includes(context.xAxis) ? data[context.xAxis] : [...Array(dataLength).keys()];

        const max = (obj) => Math.max(...[].concat(...Object.values(obj)));
        const min = (obj) => Math.min(...[].concat(...Object.values(obj)));

        const [minX, maxX] = [Math.min(...xAxis), Math.max(...xAxis)];
        const [minY, maxY] = [min(filteredData), max(filteredData)];

        const deltaX = Math.max(1, maxX - minX);
        const deltaY = Math.max(1, maxY - minY);

        const valueToXCoordinate = (val) => (val-minX)/deltaX*width;

        const valueToYCoordinate = (val) => height - (val-minY)/deltaY*height;

        const zip = (a, b) => Array(Math.max(b.length, a.length)).fill().map((_,i) => [a[i], b[i]]);

        c.clearRect(0, 0, width, height);

        c.beginPath();

        c.fillStyle = '#000000';
        c.lineWidth = 2;
        c.setLineDash([]);

        for(const array of Object.values(filteredData)){

            c.moveTo(valueToXCoordinate(xAxis[0]), valueToYCoordinate(array[0]));            
            
            for(const point of zip(xAxis, array)){
                c.lineTo(valueToXCoordinate(point[0]), valueToYCoordinate(point[1]));
            }

        }

        c.stroke();

        if(mousePos.x != -1){
            const getMouseX = () => mousePos.x - canvas.getBoundingClientRect().left;

            c.beginPath();

            c.fillStyle = '#000000';
            c.lineWidth = 2;
            c.setLineDash([2, 2]);

            c.moveTo(getMouseX(), 0);
            c.lineTo(getMouseX(), height);

            c.stroke();

            const nearestIndex = xAxis.reduce( 
                (accumulator, value, index) => 
                    ( 
                        Math.abs(valueToXCoordinate(value)-getMouseX())<accumulator.min ? accumulator = { min: Math.abs(valueToXCoordinate(value)-getMouseX()), index: index } : null , 
                        accumulator
                    ), 
                    {min: Math.abs(valueToXCoordinate(xAxis[0])-getMouseX()), index: xAxis[0]} 
                ).index;

            c.beginPath();
            c.font = '16px Arial';

            const roundedRect = (x, y, w, h, radius, color='black') => {
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

            const roundedRectBorder = (x, y, w, h, radius, borderThickness, borderColor='black', fillColor='white') => {
                roundedRect(x, y, w, h, radius, borderColor);
                roundedRect(x+borderThickness, y+borderThickness, w-2*borderThickness, h-2*borderThickness, radius-borderThickness, fillColor);
            }

            for(const key in filteredData){
                c.arc(valueToXCoordinate(xAxis[nearestIndex]), valueToYCoordinate(filteredData[key][nearestIndex]), 5, 0, 2 * Math.PI);

                const text = `${key} (${xAxis[nearestIndex]}, ${filteredData[key][nearestIndex]})`;
                const textWidth = c.measureText(text).width;

                const offsetX = valueToXCoordinate(xAxis[nearestIndex]) < width/2 ? 5 : -textWidth-5;

                c.fillText(
                    text, 
                    valueToXCoordinate(xAxis[nearestIndex])+offsetX, 
                    valueToYCoordinate(filteredData[key][nearestIndex])+10
                    );
            }

            c.fill();

            roundedRectBorder(20, 20, 200, 100, 7, 2);

        }

    }, [data, mousePos]);

    const onMouseMove = (e) => {
        setMousePos({
            x: e.clientX,
            y: e.clientY
        });
    }

    const onMouseLeave = () => setMousePos({x: -1, y: -1});

    return (
        <canvas ref={canvasRef} width="1000" height="500" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        </canvas>
    );

}

export default Diagram;