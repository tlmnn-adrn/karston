import React, { useRef, useEffect, useContext, useState } from 'react';

import { min, max, clamp } from '../../utils/math';
import { roundedRect } from '../../utils/canvas';
import { zip } from '../../utils/array';

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

        const [minX, maxX] = [Math.min(...xAxis), Math.max(...xAxis)];
        const [minY, maxY] = [min(filteredData), max(filteredData)];

        const deltaX = Math.max(1, maxX - minX);
        const deltaY = Math.max(1, maxY - minY);

        const valueToXCoordinate = (val) => (val-minX)/deltaX*width;
        const valueToYCoordinate = (val) => height - (val-minY)/deltaY*height;


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
            const getMouseY = () => mousePos.y - canvas.getBoundingClientRect().top;

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

            
            roundedRect(
                c,
                clamp(0, width-200)(getMouseX()), 
                clamp(0, height-100)(getMouseY()-30), 
                200, 
                100, 
                5, 
                'rgba(128,128,128,0.7)'
                );

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