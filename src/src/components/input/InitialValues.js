import React, { useContext, useEffect } from 'react';

import { CompilerContext } from '../../context';

const InitialValues = () => {

    const [context, setContext] = useContext(CompilerContext);

    const changeInitialValue = (e, key) => {

        let initialVars = context.initialVars;
        initialVars[key] = parseFloat(e.target.value);

        setContext({
            ...context,
            initialVars: initialVars
        });
    }

    const toggleYAxis = (e, key) => {

        setContext({
            ...context,
            yAxis: {
                ...context.yAxis,
                [key]: !context.yAxis[key]
            }
        })

    }

    const changeColor = (e, key) => {

        setContext({
            ...context,
            colors: {
                ...context.colors,
                [key]: e.target.value
            }
        });

    }

    return (
        <table>
            <tbody>
                {
                    Object.keys(context.initialVars).map((key) =>
                        <tr key={key}>
                            <td>
                                <input type='color' value={context.colors[key]} onChange={(e) => changeColor(e, key)}/>
                            </td>
                            <td>
                                {key}
                            </td>
                            <td>
                                <input type='number' value={context.initialVars[key]} onChange={(e) => changeInitialValue(e, key)} />
                            </td>
                            <td>
                                <input type='checkbox' checked={context.yAxis[key]} onChange={(e) => toggleYAxis(e, key)} />
                            </td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    )

}

export default InitialValues;