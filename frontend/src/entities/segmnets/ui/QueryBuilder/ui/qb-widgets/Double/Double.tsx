import React, {FC} from 'react';
import {RuleValue, TextFieldSettings, WidgetProps} from '@react-awesome-query-builder/core';
import {TextInput} from '@gravity-ui/uikit';

type TSelect = WidgetProps & TextFieldSettings<RuleValue>;

const Double: FC<TSelect> = ({value, setValue, readonly, placeholder}) => {
    const onChange = (value: string) => {
        setValue(value);
    };

    return (
        <TextInput
            type="number"
            placeholder={placeholder}
            value={String(value || '')}
            onUpdate={onChange}
            disabled={readonly}
            size="s"
        />
    );
};

export default React.memo(Double);
