import React, { useContext } from 'react';

import Diagram from './Diagram';

import { CompilerContext } from '../../context';

const OverlayDiagram = ({ results }) => {

    const [context, setContext] = useContext(CompilerContext);

    const minimize = () => setContext({
        ...context,
        showLargeDiagram: false
    })

    return (
        <div className='overlay'>
            <div className='minimize' onClick={minimize}>
                x
            </div>
            <Diagram data={results}/>
        </div>
    );
}

export default OverlayDiagram;