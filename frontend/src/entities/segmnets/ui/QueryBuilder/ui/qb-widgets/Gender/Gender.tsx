import React, {ChangeEvent, FC} from 'react';
import {RuleValue, TextFieldSettings, WidgetProps} from '@react-awesome-query-builder/core';
import {SegmentedRadioGroup} from '@gravity-ui/uikit';

import styles from './Gender.module.scss';

type TSelect = WidgetProps &
    TextFieldSettings<RuleValue> & {
        labelYes: string;
        labelNo: string;
    };

export enum EGenderValue {
    male = 'm',
    female = 'f',
}

const Gender: FC<TSelect> = ({value, setValue, readonly, labelYes, labelNo}) => {
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value: string = e.target.value;

        setValue(value);
    };

    const options = [
        {
            value: EGenderValue.female,
            content: labelYes,
        },
        {
            value: EGenderValue.male,
            content: labelNo,
        },
    ];

    return (
        <SegmentedRadioGroup
            options={options}
            value={value as EGenderValue}
            disabled={readonly}
            onChange={onChange}
            className={styles.radio}
            size="s"
        />
    );
};

export default React.memo(Gender);
