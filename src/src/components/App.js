import React, { useState, useEffect } from 'react';

import Text from './input/Text';
import InitialValues from './input/InitialValues';
import Iterations from './input/Iterations';
import Diagram from './output/Diagram';
import SelectionX from './output/SelectionX';
import OverlayDiagram from './output/OverlayDiagram';

import { CompilerContext } from '../context';

import { Parser, Grammar } from 'nearley';
import grammar from '../compiler/grammar.ne';

import '../../css/layout.css';
import '../../css/style.css';

const App = () => {

    const [context, setContext] = useState({
        code: '',
        initialVars: {},
        iterations: 1000,
        xAxis: null,
        yAxis: {},
        colors: {},
        showLargeDiagram: false
    });

    const [results, setResults] = useState({});

    const parser = new Parser(Grammar.fromCompiled(grammar));

    useEffect(() => {

        let vars = context.initialVars;

        try {

            parser.feed(context.code);
            const ast = parser.results;
            vars = ast[0].register_vars({});

        } catch (err) {
        }

        const initialVars = Object.keys(vars)
            .reduce((accumulator, key) => (accumulator[key] = key in context.initialVars ? context.initialVars[key] : 0, accumulator), {});

        const yAxis = Object.keys(vars)
            .reduce((accumulator, key) => (accumulator[key] = key in context.yAxis ? context.yAxis[key] : false, accumulator), {});

        const colors = Object.keys(vars)
            .reduce((accumulator, key) => (accumulator[key] = key in context.colors ? context.colors[key] : '#000000', accumulator), {});

        setContext({
            ...context,
            initialVars: initialVars,
            yAxis: yAxis,
            colors: colors
        })
    }, [context.code]);

    useEffect(() => {
        try {

            parser.feed(context.code);
            const ast = parser.results[0];

            let vars = Object.assign({}, context.initialVars);


            const newResults = Object.keys(vars)
                .reduce((accumulator, key) => (accumulator[key] = [], accumulator), {});

            for (let i = 0; i < context.iterations; i++) {
                ast.run(vars);

                for (const key in vars) {
                    newResults[key].push(vars[key]);
                }
            }

            setResults(newResults);

        } catch (err) {
        }

    }, [context]);

    const setDiagramFullscreen = () => setContext({...context, showLargeDiagram: !context.showLargeDiagram});

    return (
        <CompilerContext.Provider value={[context, setContext]}>
            <div className='grid-container'>
                <div className='text-editor-item'>
                    <Iterations />
                    <Text />
                </div>
                <div className='graph-output-item' onClick={setDiagramFullscreen}>
                    <Diagram data={results} />
                </div>
                <div className='initial-values-item'>
                    <SelectionX />
                    <br />
                    <InitialValues />
                </div>
            </div>
            {
                context.showLargeDiagram && (
                    <OverlayDiagram results={results}/>
                )
            }
        </CompilerContext.Provider>
    );
};

export default App;