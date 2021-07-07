import React, { useContext, useEffect } from 'react';

import { CompilerContext } from '../../context';

const SelectionX = () => {

    const [context, setContext] = useContext(CompilerContext);

    const onChange = (e) => {
        setContext({
            ...context,
            xAxis: e.target.value
        });
    }

    useEffect(() => {

        if(context.xAxis && !Object.keys(context.initialVars).includes(context.xAxis)){
            setContext({
                ...context,
                xAxis: null
            });
        }

    }, [context.initialVars]);

    return (
        <select onChange={onChange} value={context.xAxis ? context.xAxis : 't'}>
            <option value={null}>iterations</option>
            {
                Object.keys(context.initialVars).map((key) => (
                    <option value={key} key={'select-x-'+key}>
                        {key}
                    </option>
                ))
            }
        </select>
    )

}

export default SelectionX;