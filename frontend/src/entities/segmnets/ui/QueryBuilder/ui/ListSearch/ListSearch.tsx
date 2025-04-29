import React from 'react';
import {TextInput} from '@gravity-ui/uikit';
import cn from 'classnames';

import styles from './ListSearch.module.scss';

export interface IListSearch {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    controls?: React.ReactNode;
    isLocked?: boolean;
    className?: string;
}

export const ListSearch: React.FC<IListSearch> = (props) => {
    return (
        <div className={cn(styles.wrapper, props.className)}>
            <div className={styles.search}>
                <TextInput
                    hasClear
                    className={styles.input}
                    value={props.value}
                    onUpdate={props.onChange}
                    placeholder={props.placeholder}
                    disabled={props.isLocked}
                />
                {props.controls}
            </div>
        </div>
    );
};
