import React, {FC} from 'react';
import {WidgetProps} from '@react-awesome-query-builder/core';
import {DateTime, dateTimeParse} from '@gravity-ui/date-utils';

import {DatePicker} from '@/shared/ui';

const DateWidget: FC<WidgetProps> = ({value, setValue, readonly}) => {
    const onChange = (date: DateTime | null) => {
        setValue(date?.format('DD-MM-YYYY'));
    };

    return (
        <DatePicker
            value={dateTimeParse(value, {
                format: 'DD-MM-YYYY',
            })}
            onUpdate={onChange}
            disabled={readonly}
            size="s"
        />
    );
};

export default React.memo(DateWidget);
