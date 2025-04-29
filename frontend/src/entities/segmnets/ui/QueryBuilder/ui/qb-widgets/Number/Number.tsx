import React, {ChangeEvent, FC} from 'react';
import {RuleValue, TextFieldSettings, WidgetProps} from '@react-awesome-query-builder/core';
import {TextInput} from '@gravity-ui/uikit';

type TSelect = WidgetProps & TextFieldSettings<RuleValue>;

const Number: FC<TSelect> = ({value, setValue, readonly, placeholder}) => {
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value: string | undefined = e.target.value;
        if (value === '') value = undefined;
        setValue(value);
    };

    return (
        <TextInput
            type="number"
            placeholder={placeholder}
            value={String(value || '')}
            onChange={onChange}
            disabled={readonly}
            size="s"
        />
    );
};

export default React.memo(Number);
