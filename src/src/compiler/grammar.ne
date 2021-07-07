@{%

//import {Identifier, Number, Assignment, Sum, Sub, Mul, Div} from './ast.js';

const ast = require('./ast.js');

const moo = require('moo');

let lexer = moo.compile({
    number: /\d+(?:\.\d*)?/,
    identifier: /[A-Za-z][A-Za-z0-9_]*/,
    operator: ['+', '-', '*', '/'],
    lparen: '(',
    rparen: ')',
    equals: '=',
    nl: {match: /\n/, lineBreaks: true},
    ws:      /[ \t]+/,
});

lexer.next = (next => () => {
    let tok;
    while ((tok = next.call(lexer)) && (tok.type === "comment" || tok.type === "ws" )) {}
    return tok;
})(lexer.next);

%}

@lexer lexer

programm -> (command %nl):+ {%
    (data) => new ast.Programm(data)

%}

command -> identifier %equals statement {%
    (data) => new ast.Assignment(data[0], data[2])
%}

identifier -> %identifier {%
    (data) => new ast.Identifier(data[0].text)
%}

statement -> %lparen statement %rparen {%
    (data) => data[1]
%}

statement -> statement %operator statement {%
    function(data){
        switch(data[1].text){
            case '+':
                return new ast.Sum(data[0], data[2]);
                break;
            
            case '-':
                return new ast.Sub(data[0], data[2]);
                break;
            
            case '*':
                return new ast.Mul(data[0], data[2]);
                break;
            
            case '/':
                return new ast.Div(data[0], data[2]);
                break;
            
            default:
                return new ast.Sum(data[0], data[2]);
        }
    }
%}

statement -> %number {%
    (data) => new ast.Number(data[0].text)
%}

statement -> identifier {%
    (data) => data[0]
%}