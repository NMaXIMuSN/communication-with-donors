import React from 'react';
import cn from 'classnames';
import styles from './styles.module.scss';
import {Text} from '@gravity-ui/uikit';

export interface FieldWrapperProps {
    children: React.ReactNode;
    error?: string;
    className?: string;
}

function renderError(errorText: string) {
    return (
        <Text variant="body-1" color="danger" className={styles.fieldWrapperErrorText}>
            {errorText}
        </Text>
    );
}

export function FieldWrapper({error, children, className}: FieldWrapperProps) {
    return (
        <span className={cn(styles.fieldWrapper, className)}>
            {children}
            {error && renderError(error)}
        </span>
    );
}
