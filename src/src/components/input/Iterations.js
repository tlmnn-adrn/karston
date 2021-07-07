import React, {useContext} from 'react';

import { CompilerContext } from '../../context';

const Iterations = () => {

    const [context, setContext] = useContext(CompilerContext);

    const onChange = (e) => {
        setContext({
            ...context,
            iterations: parseInt(e.target.value)
        });
    }

    return (
        <>
            Repeat 
            <input type='number' value={context.iterations} onChange={onChange}/>
            Times
        </>
    );

}

export default Iterations;