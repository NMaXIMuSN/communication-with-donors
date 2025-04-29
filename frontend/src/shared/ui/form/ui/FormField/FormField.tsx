import React from 'react';
import cn from 'classnames';

import {FORM_ERROR} from 'final-form';
import {FieldMetaState} from 'react-final-form';
import {FieldWrapper} from './FieldWrapper';

import styles from './styles.module.scss';
export interface FormFieldProps<T> {
    children: NonNullable<React.ReactNode>;
    meta: FieldMetaState<T>;
    noErrorMessage?: boolean;
    className?: string;
    qa?: string;
}

export function resolveError({
    touched,
    error,
    submitError,
    dirty,
    dirtySinceLastSubmit,
}: FieldMetaState<unknown>): string | undefined {
    const resolvedError = error?.[FORM_ERROR] || error || submitError;
    const touchedOrDirty = touched ?? dirty; // workaround for FieldArray

    if (!resolvedError || !touchedOrDirty || (!error && dirtySinceLastSubmit)) {
        return undefined;
    }

    return String(resolvedError);
}

export function FormField<T>({
    noErrorMessage = false,
    meta,
    children,
    className,
    qa,
}: FormFieldProps<T>) {
    return (
        <div className={cn(className, styles.field)} data-qa={qa && `${qa}-form-field`}>
            <FieldWrapper error={noErrorMessage ? undefined : resolveError(meta)}>
                {children}
            </FieldWrapper>
        </div>
    );
}
