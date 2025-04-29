import React from 'react';

import styles from './EmptyMessage.module.scss';

export const EmptyMessage: React.FC = () => {
    return (
        <div className={styles.container} data-qa="data-grid-empty-msg">
            Ничего не найдено
        </div>
    );
};
