const zip = (a, b) => Array(Math.max(b.length, a.length)).fill().map((_,i) => [a[i], b[i]]);

export { zip }