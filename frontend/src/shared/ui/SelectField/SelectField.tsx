import {FC} from 'react';
import cn from 'classnames';
import {Select, SelectProps} from '@gravity-ui/uikit';

import styles from './SelectField.module.scss';

export const SelectField: FC<SelectProps> = (props) => {
    return (
        <Select
            size="m"
            width="max"
            pin="round-round"
            view="normal"
            className={cn(styles.wrapper, props.className)}
            popupClassName={styles.popup}
            {...props}
        />
    );
};
