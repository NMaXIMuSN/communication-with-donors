import React from 'react';
import cn from 'classnames';

import styles from './ItemsTreeColumn.module.scss';

export type TItemsTreeColumnProps = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>;

export const ItemsTreeColumn: React.FC<TItemsTreeColumnProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div className={cn(styles.wrapper, className)} {...props}>
            {children}
        </div>
    );
};
