import React, { useRef, useEffect, useContext, useState } from 'react';

import { min, max, clamp, findInterval } from '../../utils/math';
import { roundedRect, arrow } from '../../utils/canvas';
import { zip } from '../../utils/array';

import { CompilerContext } from '../../context';

const Diagram = ({ data, paddingX = 90, paddingY = 50, fontSize = 16, boxPadding = 6 }) => {

    const canvasRef = useRef(null);

    const [context, setContext] = useContext(CompilerContext);

    const [mousePos, setMousePos] = useState(0);

    useEffect(() => {

        const canvas = canvasRef.current;
        const c = canvas.getContext('2d');

        c.font = `${fontSize}px Arial`;
        c.fillStyle = '#000000';
        c.lineWidth = 2;
        c.setLineDash([]);

        const width = canvas.width;
        const height = canvas.height;

        const filteredData = Object.keys(data)
            .reduce((accumulator, key) => (context.yAxis[key] && (accumulator[key] = data[key]), accumulator), {});

        const dataLength = Object.entries(filteredData).length ? filteredData[Object.keys(filteredData)[0]].length : 0;

        const xAxis = context.xAxis && Object.keys(context.initialVars).includes(context.xAxis) ? data[context.xAxis] : [...Array(dataLength).keys()];

        let [minX, maxX] = [Math.min(...xAxis), Math.max(...xAxis)];
        let [minY, maxY] = [min(filteredData), max(filteredData)];

        const intervalX = findInterval(minX, maxX);
        const intervalY = findInterval(minY, maxY);

        minX = intervalX[0];
        maxX = intervalX[intervalX.length-1];

        minY = intervalY[0];
        maxY = intervalY[intervalY.length-1];

        const deltaX = maxX - minX;
        const deltaY = maxY - minY;

        const valueToXCoordinate = (val) => (val - minX) / deltaX * width * (width - 2 * paddingX) / width + paddingX;
        const valueToYCoordinate = (val) => height - (val - minY) / deltaY * height * (height - 2 * paddingY) / height - paddingY;

        c.clearRect(0, 0, width, height);

        const xAxisY = clamp(paddingY, height - paddingY)(valueToYCoordinate(0)) == valueToYCoordinate(0) ? valueToYCoordinate(0) : height - paddingY;

        arrow(c, paddingX, xAxisY, width - paddingX / 2, xAxisY);

        intervalX.forEach((value) => {

            c.beginPath();
            c.moveTo(valueToXCoordinate(value), xAxisY + fontSize/2);
            c.lineTo(valueToXCoordinate(value), xAxisY - fontSize/2);
            c.stroke();

            const text = paddingX - c.measureText(value).width - fontSize > 0 && Math.abs(value) < 1000000 && (0.01 <= Math.abs(value) || value === 0)  ? value : value.toExponential(2);

            c.fillText(text, valueToXCoordinate(value) - c.measureText(text).width/2, xAxisY + fontSize + 8);

        });

        const yAxisX = clamp(paddingX, width - paddingX)(valueToXCoordinate(0)) == valueToXCoordinate(0) ? valueToXCoordinate(0) : paddingX;

        arrow(c, yAxisX, height - paddingY, yAxisX, paddingY / 2);

        intervalY.forEach((value) => {

            c.beginPath();
            c.moveTo(yAxisX+fontSize/2, valueToYCoordinate(value));
            c.lineTo(yAxisX-fontSize/2, valueToYCoordinate(value));
            c.stroke();

            const text = yAxisX - c.measureText(value).width - fontSize > 0 && Math.abs(value) < 1000000 && (0.01 <= Math.abs(value) || value === 0)  ? value : value.toExponential(2);

            c.fillText(text, yAxisX - c.measureText(text).width - fontSize, valueToYCoordinate(value)+fontSize/2);

        });

        c.save();
        
        for (const key in filteredData) {

            const array = filteredData[key];

            c.strokeStyle = context.colors[key];

            c.moveTo(valueToXCoordinate(xAxis[0]), valueToYCoordinate(array[0]));

            for (const point of zip(xAxis, array)) {
                c.lineTo(valueToXCoordinate(point[0]), valueToYCoordinate(point[1]));
            }


        }

        c.stroke();
        c.restore();

        if (mousePos.x != -1) {
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
                    Math.abs(valueToXCoordinate(value) - getMouseX()) < accumulator.min ? accumulator = { min: Math.abs(valueToXCoordinate(value) - getMouseX()), index: index } : null,
                    accumulator
                ),
                { min: Math.abs(valueToXCoordinate(xAxis[0]) - getMouseX()), index: xAxis[0] }
            ).index;

            c.beginPath();

            const boxHeight = boxPadding + (fontSize + boxPadding) * (Object.keys(filteredData).length + 1);
            const boxWidth = 300;

            roundedRect(
                c,
                clamp(0, width - boxWidth)(getMouseX()),
                clamp(0, height - boxHeight)(getMouseY() - boxHeight * 0.3),
                boxWidth,
                boxHeight,
                5,
                'rgba(128,128,128,0.7)'
            );

            let dx = fontSize + boxPadding - 2;

            c.fillText(
                `${context.xAxis ? context.xAxis : 'iterations'}: ${xAxis[nearestIndex] ? xAxis[nearestIndex] : 0}`,
                clamp(0, width - boxWidth)(getMouseX()) + boxPadding,
                clamp(0, height - boxHeight)(getMouseY() - boxHeight * 0.3) + dx);

            dx += fontSize + boxPadding;

            for (const key in filteredData) {

                c.fillText(`${key}: ${filteredData[key][nearestIndex]}`, clamp(0, width - boxWidth)(getMouseX()) + boxPadding, clamp(0, height - boxHeight)(getMouseY() - boxHeight * 0.3) + dx);
                dx += fontSize + boxPadding;

                c.beginPath();
                c.arc(valueToXCoordinate(xAxis[nearestIndex]), valueToYCoordinate(filteredData[key][nearestIndex]), 5, 0, 2 * Math.PI);
                c.fill();

            }

        }

    }, [data, mousePos]);

    const onMouseMove = (e) => {
        setMousePos({
            x: e.clientX,
            y: e.clientY
        });
    }

    const onMouseLeave = () => setMousePos({ x: -1, y: -1 });

    return (
        <canvas ref={canvasRef} width="1200" height="600" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        </canvas>
    );

}

export default Diagram;