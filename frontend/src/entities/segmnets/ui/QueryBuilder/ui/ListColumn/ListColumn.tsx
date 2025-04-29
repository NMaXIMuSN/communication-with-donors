import React from 'react';
import cn from 'classnames';

import styles from './ListColumn.module.scss';

export type TListColumnProps = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>;

export const ListColumn: React.FC<TListColumnProps> = ({className, children, ...props}) => {
    return (
        <div className={cn(styles.wrapper, className)} {...props}>
            {children}
        </div>
    );
};
