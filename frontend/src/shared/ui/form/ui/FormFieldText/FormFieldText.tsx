import React from 'react';
import {TextInput, TextInputProps} from '@gravity-ui/uikit';
import {FieldRenderProps} from 'react-final-form';
import {FormField} from '../FormField/FormField';
import cn from 'classnames';

import {PickKnownFieldProps, resolveError} from '@/shared/ui/form';

import styles from './FormFieldText.module.scss';

interface IProps
    extends PickKnownFieldProps<FieldRenderProps<string, HTMLInputElement>>,
        TextInputProps {
    noErrorMessage?: boolean;
    accept?: (value: string) => boolean;
    className?: string;
    autoComplete?: boolean;
    controlClassName?: string;
}
// Отдельный компонент нужен для стейта ошибки внутри инпута, клайд компоненты не даёт такой возможности
const FormFieldText: React.FC<IProps> = (props) => {
    const {
        input: {name, value, onFocus, onBlur, onChange},
        meta,
        noErrorMessage,
        accept,
        className,
        controlClassName,
        autoComplete,
        ...restProps
    } = props;
    const error = resolveError(meta);

    const handleUpdate = (value: string) => {
        if (value !== '' && accept && !accept(value)) {
            return;
        }

        onChange(value);
    };

    const inputProps = {
        ...restProps,
        name,
        value,
        onFocus,
        onBlur,
        onUpdate: handleUpdate,
        className: cn(controlClassName, styles.textInput),
        error: noErrorMessage ? error : Boolean(error),
    } as TextInputProps;

    return (
        <FormField meta={meta} className={className} noErrorMessage={noErrorMessage}>
            <TextInput {...inputProps} autoComplete={autoComplete}/>
        </FormField>
    );
};

export default FormFieldText;
