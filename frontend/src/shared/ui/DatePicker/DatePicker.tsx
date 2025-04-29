import {FC} from 'react';
import {DateFieldProps, DatePicker as _DatePicker} from '@gravity-ui/date-components';

import styles from './DatePicker.module.scss';

export const DatePicker: FC<DateFieldProps & {iconBeforeInput?: boolean}> = ({
    onUpdate,
    ...props
}) => {
    return (
        <div className={styles.wrapper}>
            <_DatePicker {...props} onUpdate={onUpdate} format="DD.MM.YYYY" />
        </div>
    );
};
