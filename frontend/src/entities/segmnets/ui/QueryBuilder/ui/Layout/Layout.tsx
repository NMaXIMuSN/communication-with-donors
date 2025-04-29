import React from 'react';
import cn from 'classnames';

import styles from './Layout.module.scss';

export type TLayoutProps = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>;

export const Layout: React.FC<TLayoutProps> = ({className, children, ...props}) => {
    return (
        <div className={cn(styles.wrapper, className)} {...props}>
            {children}
        </div>
    );
};
