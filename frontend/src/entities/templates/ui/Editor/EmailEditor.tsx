import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import {html} from '@codemirror/lang-html';
import {bbedit} from '@uiw/codemirror-theme-bbedit';
import {EditorView} from '@codemirror/view';

import styles from './styles.module.scss';
import {Field} from 'react-final-form';
import {useGetSettingFieldName} from '../../model/form';

export const EmailEditor = () => {
    const getName = useGetSettingFieldName();
    return (
        <Field name={getName('content')}>
            {(props) => (
                <CodeMirror
                    {...props.input}
                    className={styles.codemirror}
                    height="100%"
                    basicSetup={{}}
                    theme={bbedit}
                    extensions={[html({autoCloseTags: true}), EditorView.lineWrapping]}
                    onChange={(value: string) => props.input.onChange(value)}
                />
            )}
        </Field>
    );
};
