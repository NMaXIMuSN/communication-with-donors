import React from 'react';
import {Text} from '@gravity-ui/uikit';
import cn from 'classnames';

import styles from './ListGroup.module.scss';

export interface IListGroup {
    title: string;
    className?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export const ListGroup: React.FC<IListGroup> = (props) => {
    return (
        <div className={cn(styles.wrapper, props.className)}>
            <div className={styles.titleBox}>
                <div className={styles.icon}>{props.icon}</div>
                <Text variant="subheader-1" className={styles.title}>
                    {props.title}
                </Text>
            </div>
            <div className={styles.items}>{props.children}</div>
        </div>
    );
};
