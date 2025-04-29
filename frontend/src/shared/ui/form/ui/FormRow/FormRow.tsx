import React, {useId} from 'react';
import cn from 'classnames';

import styles from './FormRow.module.scss';

interface IProps {
    label: React.ReactNode;
    required?: boolean;
    children: (id: string) => React.ReactNode;
    isVertical?: boolean;
}

export const FormRow = ({label, required, isVertical, children}: IProps) => {
    const id = useId();

    return (
        <div className={cn(styles.row, {[styles.vertical]: isVertical})}>
            <label
                className={cn(styles.label, {
                    [styles.required]: required,
                })}
                id={id}
            >
                {label}
            </label>
            {children(id)}
        </div>
    );
};
