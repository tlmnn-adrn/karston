import React from 'react';

import  '../../../css/textHighlight.css';

const moo = require("moo");

let lexer = moo.compile({
  ws: /[ \t]+/,
  number: /\d+(?:\.\d*)?/,
  identifier: /[A-Za-z][A-Za-z0-9_]*/,
  operator: ["+", "-", "*", "/", "="],
  punctuation: ["(", ")", "."],
  nl: { match: /\n/, lineBreaks: true },
  other: /./
});

const TextHighlighter = ({ code }) => {
  lexer.reset(code);

  return (
    <>
      {Array.from(lexer).map((token, index) => (
        <span key={`token-${index}`} className={`token-${token.type}`}>
          {token.text}
        </span>
      ))}
    </>
  );
};

export default TextHighlighter;
