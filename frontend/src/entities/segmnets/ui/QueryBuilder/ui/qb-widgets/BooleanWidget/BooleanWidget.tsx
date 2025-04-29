import React, {ChangeEvent, FC} from 'react';
import {RuleValue, TextFieldSettings, WidgetProps} from '@react-awesome-query-builder/core';
import {SegmentedRadioGroup} from '@gravity-ui/uikit';

import styles from './BooleanWidget.module.scss';

type TSelect = WidgetProps &
    TextFieldSettings<RuleValue> & {
        labelYes: string;
        labelNo: string;
    };

const BooleanWidget: FC<TSelect> = ({value, setValue, readonly, labelYes, labelNo}) => {
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value: string = e.target.value;

        setValue(Boolean(value));
    };

    const options = [
        {
            value: '1',
            content: labelYes,
        },
        {
            value: '',
            content: labelNo,
        },
    ];

    return (
        <SegmentedRadioGroup
            options={options}
            value={value ? '1' : ''}
            disabled={readonly}
            onChange={onChange}
            className={styles.radio}
            size="s"
        />
    );
};

export default React.memo(BooleanWidget);
