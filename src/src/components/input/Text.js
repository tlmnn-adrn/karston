import React, { useContext } from 'react';

import { CompilerContext } from '../../context';

import Editor from "react-simple-code-editor";
import TextHighlighter from './TextHighlighter';

const Text = () => {

    const [context, setContext] = useContext(CompilerContext);

    const onChange = (code) => {
        setContext({
            ...context,
            code: code
        });
    }

    return (
        <Editor
        value={context.code}
        onValueChange={(code) => onChange(code)}
        highlight={() => <TextHighlighter code={context.code} />}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12
        }}
      />
    )
}

export default Text;