import React, {FC} from 'react';
import {RuleValue, TextFieldSettings, WidgetProps} from '@react-awesome-query-builder/core';
import {TextArea} from '@gravity-ui/uikit';

type TSelect = WidgetProps & TextFieldSettings<RuleValue>;

const Text: FC<TSelect> = ({value = '', setValue, readonly, placeholder}) => {
    const onChange = (value: string) => {
        setValue(value);
    };

    return (
        <TextArea
            placeholder={placeholder}
            value={value}
            onUpdate={onChange}
            disabled={readonly}
            size="s"
        />
    );
};

export default React.memo(Text);
