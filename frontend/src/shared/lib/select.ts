import {TextProps} from '@gravity-ui/uikit';

export type SelectItem<Value> = {
    id: string;
    textVariant?: TextProps['variant'];
    display: string;
    value: Value;
};

export type SuggestSelectItem = {
    value: string | number;
    label: string;
    meta?: Record<string, unknown>;
};

export type TSelectGroup<Value> = {
    id: string;
    topmost?: boolean;
    collapsible?: boolean;
    name?: string;
    expand?: boolean;
    value?: SelectItem<Value>;
    items: Record<string, SelectItem<Value>>;
};

export interface IOption {
    label: string;
    value: string;
    meta?: Record<string, unknown>;
}
