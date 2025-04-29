import React, {FC} from 'react';
import CodeMirror from '@uiw/react-codemirror';
import {html} from '@codemirror/lang-html';
import {bbedit} from '@uiw/codemirror-theme-bbedit';
import {EditorView} from '@codemirror/view';

import styles from './styles.module.scss';
import {Field} from 'react-final-form';
import {useGetSettingFieldName} from '@/entities/templates/model/form';
import {IEditorProps} from './TemplateEditor';

export const EmailEditor: FC<IEditorProps> = ({canEdit}) => {
    const getName = useGetSettingFieldName();
    return (
        <Field name={getName('content')}>
            {(props) => (
                <CodeMirror
                    {...props.input}
                    className={styles.codemirror}
                    height="100%"
                    theme={bbedit}
                    editable={canEdit}
                    extensions={[html({autoCloseTags: true}), EditorView.lineWrapping]}
                    onChange={(value: string) => props.input.onChange(value)}
                />
            )}
        </Field>
    );
};
