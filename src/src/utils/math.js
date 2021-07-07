const clamp = (min, max) => (value) =>
    value < min ? min : value > max ? max : value;

const min = (obj) => {
    console.assert(typeof obj == 'object', 'Use Math.min instead');

    if(typeof obj == 'object'){
        return Math.min(...Object.values(obj))
    }

    return Math.min(...[].concat(...Object.values(obj)))
};

const max = (obj) => {
    console.assert(typeof obj == 'object', 'Use Math.max instead');

    if(typeof obj == 'object'){
        return Math.max(...Object.values(obj))
    }

    return Math.max(...[].concat(...Object.values(obj)))
};

export {clamp, min, max};