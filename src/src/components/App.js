import React, { useState, useEffect } from 'react';

import Text from './input/Text';
import InitialValues from './input/InitialValues';
import Iterations  from './input/Iterations';
import Diagram from './output/Diagram';
import SelectionX from './output/SelectionX';

import { CompilerContext } from '../context';

import { Parser, Grammar } from 'nearley';
import grammar from '../compiler/grammar.ne';

const App = () => {

    const [context, setContext] = useState({
        code: '',
        initialVars: {},
        iterations: 1000,
        xAxis: null,
        yAxis: {},
    });

    const [results, setResults] = useState({});

    const parser = new Parser(Grammar.fromCompiled(grammar));

    useEffect(() => {

        let vars = context.initialVars;

        try{

            parser.feed(context.code);
            const ast = parser.results;
            vars = ast[0].register_vars({});

        }catch(err){
        }

        const initialVars = Object.keys(vars)
                                    .reduce( (accumulator, key) => (accumulator[key] = key in context.initialVars ? context.initialVars[key] : 0, accumulator), {} );
        
        const yAxis = Object.keys(vars)
                                    .reduce( (accumulator, key) => (accumulator[key] = key in context.yAxis ? context.yAxis[key] : false, accumulator), {} );

        setContext({
            ...context,
            initialVars: initialVars,
            yAxis: yAxis
        })
    }, [context.code]);

    useEffect(() => {
        try{

            parser.feed(context.code);
            const ast = parser.results[0];
    
            let vars = Object.assign({}, context.initialVars);

            
            const newResults = Object.keys(vars)
                                        .reduce( (accumulator, key) => (accumulator[key] = [], accumulator), {} );
    
            for(let i=0; i<context.iterations; i++){
                ast.run(vars);

                for (const key in vars) {
                    newResults[key].push(vars[key]);
                }
            }

            setResults(newResults);

        }catch(err){
        }

    }, [context]);

    return (
        <CompilerContext.Provider value={[context, setContext]}>
            <Iterations />
            <br />
            <Text />
            <br />
            <InitialValues />
            <br />
            <Diagram data={results} />
            <br />
            <SelectionX />
        </CompilerContext.Provider>
    );
};

export default App;