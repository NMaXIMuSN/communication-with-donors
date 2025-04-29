import React, {FC} from 'react';
import {FieldProps} from '@react-awesome-query-builder/core';

import {SelectField} from '@/shared/ui';

import styles from './CustomOperator.module.scss';

const CustomOperator: FC<FieldProps> = ({items, setField, selectedKey, readonly}) => {
    const hasValue = selectedKey != null;

    const options = items.map((item) => {
        return {
            value: item.key,
            content: item.label,
        };
    });

    const onChange = (key: string) => {
        const newValue = items.find((op) => op.key === key)?.path;
        if (newValue) setField(newValue);
    };

    return (
        <SelectField
            value={hasValue ? [selectedKey] : []}
            options={options}
            onUpdate={(nextValue) => onChange(nextValue[0])}
            disabled={readonly}
            className={styles.field}
            size="s"
            placeholder="—"
        />
    );
};

export default React.memo(CustomOperator);
