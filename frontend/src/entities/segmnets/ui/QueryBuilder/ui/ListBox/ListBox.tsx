import React from 'react';
import cn from 'classnames';

import styles from './ListBox.module.scss';

export type TListBoxProps = React.PropsWithChildren & React.HTMLAttributes<HTMLDivElement>;

export const ListBox: React.FC<TListBoxProps> = ({className, children, ...props}) => {
    return (
        <div className={cn(styles.wrapper, className)} {...props}>
            {children}
        </div>
    );
};
