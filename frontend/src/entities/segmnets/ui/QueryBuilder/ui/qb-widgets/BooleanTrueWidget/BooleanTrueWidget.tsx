import React, {FC} from 'react';
import {noop} from 'lodash';
import {RuleValue, TextFieldSettings, WidgetProps} from '@react-awesome-query-builder/core';
import {SegmentedRadioGroup} from '@gravity-ui/uikit';

import styles from './BooleanTrueWidget.module.scss';

type TSelect = WidgetProps &
    TextFieldSettings<RuleValue> & {
        labelYes: string;
        labelNo: string;
    };

const BooleanTrueWidget: FC<TSelect> = ({labelYes, labelNo, value}) => {
    const options = [
        {
            value: 'true',
            content: labelYes,
        },
        {
            value: 'false',
            content: labelNo,
        },
    ];

    return (
        <SegmentedRadioGroup
            options={options}
            value={String(value)}
            onChange={noop}
            className={styles.radio}
            disabled
            size="s"
        />
    );
};

export default React.memo(BooleanTrueWidget);
