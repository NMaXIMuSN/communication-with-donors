import {useGetSettingFieldName} from '@/entities/templates/model/form';
import {bbedit} from '@uiw/codemirror-theme-bbedit';
import MarkdownEditor from '@uiw/react-markdown-editor';
import {Field} from 'react-final-form';
import cn from 'classnames';
import styles from './styles.module.scss';
import {Bold, Italic, SquareLineVertical, Strikethrough, Underline} from '@gravity-ui/icons';
import {ReactCodeMirrorRef} from '@uiw/react-codemirror';
import {FC} from 'react';
import {IEditorProps} from './TemplateEditor';
import {Button, Icon} from '@gravity-ui/uikit';

const execute = ({state, view}: ReactCodeMirrorRef, mark: string) => {
    if (!state || !view) return;

    const lineInfo = view.state.doc.lineAt(view.state.selection.main.from);

    view.dispatch({
        changes: {
            from: lineInfo.from,
            to: lineInfo.to,
            insert: `${mark} ${lineInfo.text} ${mark}`,
        },
        // selection: EditorSelection.range(lineInfo.from + mark.length, lineInfo.to),
        selection: {anchor: lineInfo.from + mark.length},
    });
};

export const TelegramEditor: FC<IEditorProps> = ({canEdit}) => {
    const getName = useGetSettingFieldName();
    return (
        <Field name={getName('content')}>
            {(props) => (
                <div data-color-mode="light">
                    <MarkdownEditor
                        {...props.input}
                        className={cn(styles.codemirror, styles.markdownEditor)}
                        height="100%"
                        basicSetup={{}}
                        theme={bbedit}
                        editable={canEdit}
                        toolbars={[
                            {
                                button: (command, _, options) => (
                                    <Button
                                        view="outlined"
                                        onClick={() => {
                                            if (options.editor.current) {
                                                command.execute?.(options.editor.current);
                                            }
                                        }}
                                    >
                                        <Icon data={Bold} />
                                    </Button>
                                ),
                                execute: (v) => execute(v, '**'),
                            },
                            {
                                button: (command, _, options) => (
                                    <Button
                                        view="outlined"
                                        onClick={() => {
                                            if (options.editor.current) {
                                                command.execute?.(options.editor.current);
                                            }
                                        }}
                                    >
                                        <Icon data={Italic} />
                                    </Button>
                                ),
                                execute: (v) => execute(v, '*'),
                            },
                            {
                                button: (command, _, options) => (
                                    <Button
                                        view="outlined"
                                        onClick={() => {
                                            if (options.editor.current) {
                                                command.execute?.(options.editor.current);
                                            }
                                        }}
                                    >
                                        <Icon data={Underline} />
                                    </Button>
                                ),
                                execute: (v) => execute(v, '__'),
                            },
                            {
                                button: (command, _, options) => (
                                    <Button
                                        view="outlined"
                                        onClick={() => {
                                            if (options.editor.current) {
                                                command.execute?.(options.editor.current);
                                            }
                                        }}
                                    >
                                        <Icon data={Strikethrough} />
                                    </Button>
                                ),
                                execute: (v) => execute(v, '~~'),
                            },
                            {
                                button: (command, _, options) => (
                                    <Button
                                        view="outlined"
                                        onClick={() => {
                                            if (options.editor.current) {
                                                command.execute?.(options.editor.current);
                                            }
                                        }}
                                    >
                                        <Icon data={SquareLineVertical} />
                                    </Button>
                                ),
                                execute: (v) => execute(v, '||'),
                            },
                        ]}
                        onChange={(value: string) => props.input.onChange(value)}
                    />
                </div>
            )}
        </Field>
    );
};
