import React, { useContext } from 'react';

import { CompilerContext } from '../../context';


const Text = () => {

    const [context, setContext] = useContext(CompilerContext);

    const onChange = (e) => {

        const code = e.target.value.endsWith('\n') ? e.target.value : e.target.value + '\n';

        setContext({
            ...context,
            code: code
        });
    }

    return (
        <textarea onChange={onChange}>
        </textarea>
    )
}

export default Text;