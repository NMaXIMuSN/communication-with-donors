import {ImmutableList, ListValues, Utils} from '@react-awesome-query-builder/core';

import {IConfig} from '../../types';
const {getTitleInListValues} = Utils.ListUtils;

export interface IWidgetFactoryProps {
    delta: number;
    isFuncArg: unknown;
    value: ImmutableList<string> | null;
    valueError: ImmutableList<string>;
    asyncListValues: unknown;
    isSpecialRange: unknown;
    fieldDefinition: {
        valueSources?: unknown[];
        defaultValue?: unknown;
        fieldSettings: {
            treeValues: unknown;
            listValues: unknown;
        };
    };
    widgetDefinition: {
        factory: Function;
        labelYes: unknown;
        labelNo: unknown;
    };
    widgetValueLabel: {
        label: unknown;
        placeholder: unknown;
    };
    valueLabels: {
        placeholder: unknown;
    };
    textSeparators: unknown;
    setValueHandler: unknown;
    config: IConfig;
    field: string;
    operator?: string | null;
    readonly: boolean;
    parentField?: string | null;
    parentFuncs: unknown;
    id: string;
    groupId?: string;
    operatorComponent?: React.ReactNode | null;
}

export const WidgetFactory = ({
    delta,
    isFuncArg,
    value: immValue,
    valueError: immValueError,
    asyncListValues,
    isSpecialRange,
    fieldDefinition,
    widgetDefinition,
    widgetValueLabel,
    valueLabels,
    textSeparators,
    setValueHandler,
    config,
    field,
    operator,
    readonly,
    parentField,
    parentFuncs,
    id,
    groupId,
    operatorComponent,
}: IWidgetFactoryProps) => {
    const {factory: widgetFactory, ...fieldWidgetProps} = widgetDefinition;
    const isConst =
        isFuncArg &&
        fieldDefinition &&
        fieldDefinition.valueSources &&
        fieldDefinition.valueSources.length == 1 &&
        fieldDefinition.valueSources[0] == 'const';
    const defaultValue = fieldDefinition.defaultValue;

    if (!widgetFactory) {
        return '?';
    }

    let value =
        isSpecialRange && immValue
            ? [immValue.get(0), immValue.get(1)]
            : immValue
              ? immValue.get(delta)
              : undefined;
    const valueError =
        (immValueError &&
            (isSpecialRange
                ? [immValueError.get(0), immValueError.get(1)]
                : immValueError.get(delta))) ||
        null;
    if (isSpecialRange && value && value[0] === undefined && value[1] === undefined)
        value = undefined;
    const {fieldSettings} = fieldDefinition || {};
    const widgetProps = Object.assign({}, fieldWidgetProps, fieldSettings, {
        config: config,
        field: field,
        parentField: parentField,
        parentFuncs: parentFuncs,
        fieldDefinition: fieldDefinition,
        operator: operator,
        delta: delta,
        isSpecialRange: isSpecialRange,
        isFuncArg: isFuncArg,
        value: value,
        valueError: valueError,
        label: widgetValueLabel.label,
        placeholder: widgetValueLabel.placeholder,
        placeholders: valueLabels ? valueLabels.placeholder : null,
        textSeparators: textSeparators,
        setValue: setValueHandler,
        readonly: readonly,
        asyncListValues: asyncListValues,
        id,
        groupId,
        operatorComponent,
    });

    if (isConst && defaultValue) {
        const listValues = fieldSettings.treeValues || fieldSettings.listValues;
        if (typeof defaultValue === 'boolean') {
            return defaultValue ? widgetProps.labelYes || 'YES' : widgetProps.labelNo || 'NO';
        }

        if (listValues) {
            if (Array.isArray(defaultValue))
                return defaultValue
                    .map((v) => getTitleInListValues(listValues as ListValues, v) || v)
                    .join(', ');

            return getTitleInListValues(listValues as ListValues, defaultValue) || defaultValue;
        }
        return String(defaultValue);
    }

    return widgetFactory(widgetProps);
};
