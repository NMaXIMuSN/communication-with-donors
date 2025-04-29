import React, {FC} from 'react';
import {MultiSelectFieldSettings, RuleValue, WidgetProps} from '@react-awesome-query-builder/core';
import {Select} from '@gravity-ui/uikit';

type TMultiselect = WidgetProps & MultiSelectFieldSettings<RuleValue>;

const _Select: FC<TMultiselect> = (props) => {
    const {value, listValues, setValue} = props;

    const onChange = (value: string[]) => {
        setValue(value.join(','));
    };

    return (
        <Select
            value={value?.split(',').filter(Boolean)}
            multiple
            options={((listValues as any[]) || [])?.map(({value, title}) => ({
                value,
                content: title,
            }))}
            onUpdate={onChange}
        />
    );
};

export default React.memo(_Select);
