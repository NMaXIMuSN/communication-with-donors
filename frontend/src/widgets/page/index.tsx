import {PropsWithChildren} from 'react';
import styles from './styles.module.scss';

export const PageContentWrapper = ({children}: PropsWithChildren) => {
    return <div className={styles.page}>{children}</div>;
};
