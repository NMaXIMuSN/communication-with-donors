import React, {FC, useEffect, useState} from 'react';
import {WidgetProps} from '@react-awesome-query-builder/core';
import {SelectOption, TextInput} from '@gravity-ui/uikit';

import {SelectField} from '@/shared/ui';

import styles from './DateNow.module.scss';

export type TDateNow = {
    items?: SelectOption[];
} & WidgetProps;

const DateNow: FC<TDateNow> = ({value, setValue, readonly, placeholder, items}) => {
    const DATE_NOW_ITEMS: SelectOption[] = items || [
        {
            value: 'year+1',
            content: 'год вперед',
        },
        {
            value: 'quarter+',
            content: 'N кварталов вперед',
        },
        {
            value: 'quarter+1',
            content: 'квартал вперед',
        },
        {
            value: 'month+',
            content: 'N месяцев вперед',
        },
        {
            value: 'month+1',
            content: 'месяц вперед',
        },
        {
            value: 'week+2',
            content: 'две недели вперед',
        },
        {
            value: 'week+1',
            content: 'неделю вперед',
        },
        {
            value: 'day+',
            content: 'N дней вперед',
        },
        {
            value: 'day+1',
            content: 'день вперед',
        },
        {
            value: 'now',
            content: 'сегодня',
        },
        {
            value: 'day-1',
            content: 'день назад',
        },
        {
            value: 'day-',
            content: 'N дней назад',
        },
        {
            value: 'week-1',
            content: 'неделю назад',
        },
        {
            value: 'week-2',
            content: 'две недели назад',
        },
        {
            value: 'month-1',
            content: 'месяц назад',
        },
        {
            value: 'month-',
            content: 'N месяцев назад',
        },
        {
            value: 'quarter-1',
            content: 'квартал назад',
        },
        {
            value: 'quarter-',
            content: 'N кварталов назад',
        },
        {
            value: 'year-1',
            content: 'год назад',
        },
    ];

    const [time, setTime] = useState<string>('');
    const [num, setNum] = useState<string>('');

    const timeChange = (val: string) => {
        if (val === 'now' || val.includes('year') || val.includes('week')) {
            setValue(val);
            return;
        }
        if ((val.match(/\d*$/g) || [])[0]) {
            setValue(val);
            return;
        }
        if (num) {
            setValue(`${val}${num}`);
            return;
        }
        setTime(val);
    };

    const firstInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value: val} = event.target;
        if (Number(val) >= 0) setValue(`${time}${val}`);
    };

    useEffect(() => {
        if (!value) return;

        if (value === 'now' || value.includes('year') || value.includes('week')) {
            setTime(value);
            return;
        }
        setTime(value.match(/^[a-z]*[+, -]/g)[0]);
        setNum(value.match(/\d*$/g)[0]);
    }, [value]);

    return (
        <div className={styles.wrapper}>
            <SelectField
                value={time ? [time] : []}
                options={DATE_NOW_ITEMS}
                onUpdate={(nextValue) => timeChange(nextValue[0])}
                disabled={readonly}
                className={styles.select}
                placeholder="—"
                size="s"
            />
            {!(time.match(/\d*$/g) || [])[0] && time && time !== 'now' ? (
                <TextInput
                    placeholder={placeholder}
                    value={num}
                    onChange={firstInputChange}
                    disabled={readonly}
                    className={styles.input}
                    size="s"
                />
            ) : null}
        </div>
    );
};

export default React.memo(DateNow);
