const clamp = (min, max) => (value) =>
    value < min ? min : value > max ? max : value;

const min = (obj) => {
    console.assert(typeof obj == 'object', 'Use Math.min instead');

    if (typeof obj !== 'object') {
        return Math.min(...Object.values(obj))
    }

    return Math.min(...[].concat(...Object.values(obj)))
};

const max = (obj) => {
    console.assert(typeof obj == 'object', 'Use Math.max instead');

    if (typeof obj !== 'object') {
        return Math.max(...Object.values(obj))
    }

    return Math.max(...[].concat(...Object.values(obj)))
};

const floorToNearest5 = x => Math.floor(x * 2) / 2;
const ceilToNearest5 = x => Math.ceil(x * 2) / 2;

const findInterval = (min, max) => {
    
    /*console.assert(isFinite(min), 'min should be finite');
    console.assert(isFinite(max), 'max should be finite');*/

    if(!isFinite(min) || !isFinite(max)){
        return [0, 1];
    }

    const delta = max - min;

    const exponent = parseInt(delta.toExponential().split('e')[1]);

    const minFactor = min / (10 ** exponent);
    const maxFactor = max / (10 ** exponent);

    const roundedMinFactor = floorToNearest5(minFactor);
    const roundedMaxFactor = ceilToNearest5(maxFactor);
    const roundedDeltaFactor = roundedMaxFactor - roundedMinFactor;

    let numResults = 0;
    let resultDelta = 0.5;

    if (roundedDeltaFactor * 2 < 4) {
        numResults = roundedDeltaFactor * 4 + 1;
        resultDelta = 0.25;
    } else if (roundedDeltaFactor * 2 <= 10) {
        numResults = roundedDeltaFactor * 2 + 1;
    } else {
        numResults = Math.ceil(roundedDeltaFactor) + 1;
        resultDelta = 1;
    }

    const result = [...new Array(numResults).keys()];

    return result.map(x => parseFloat((x * resultDelta + roundedMinFactor)+'e'+exponent));
}
export { clamp, min, max, findInterval };