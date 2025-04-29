import {FieldRenderProps} from 'react-final-form';
import {TextArea, TextAreaProps} from '@gravity-ui/uikit';
import {FormField} from '../FormField/FormField';
import cn from 'classnames';
import {Ref, forwardRef} from 'react';

import {PickKnownFieldProps, resolveError} from '@/shared/ui/form';

import styles from './FormFieldTextArea.module.scss';

export interface IFormFieldTextAreaProps
    extends PickKnownFieldProps<FieldRenderProps<string, HTMLTextAreaElement>>,
        TextAreaProps {
    noErrorMessage?: boolean;
    accept?: (value: string) => boolean;
    className?: string;
    controlClassName?: string;
    withoutNewLine?: boolean;
}

const FormFieldTextArea = forwardRef(
    (props: IFormFieldTextAreaProps, ref?: Ref<HTMLSpanElement>) => {
        const {
            input: {name, value, onFocus, onChange, onBlur},
            meta,
            noErrorMessage,
            accept,
            className,
            controlClassName,
            withoutNewLine = false,
            ...restProps
        } = props;

        const error = resolveError(meta);
        const handleUpdate = (value: string) => {
            if (value !== '' && accept && !accept(value)) {
                return;
            }

            onChange(value);
        };

        const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
            if (withoutNewLine && event.code === 'Enter') {
                event.preventDefault();
            }
        };

        const inputProps = {
            ...restProps,
            name,
            value,
            onFocus,
            onBlur,
            onUpdate: handleUpdate,
            onKeyDown,
            className: controlClassName,
            error: Boolean(error),
        } as TextAreaProps;

        return (
            <FormField
                meta={meta}
                noErrorMessage={noErrorMessage}
                className={cn(className, styles.formInput)}
            >
                <TextArea rows={5} ref={ref} {...inputProps} />
            </FormField>
        );
    },
);

export default FormFieldTextArea;
