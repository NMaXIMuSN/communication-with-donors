import React, {Component} from 'react';
import cn from 'classnames';
import {ImmutableList, Utils, ValueSource} from '@react-awesome-query-builder/core';
import range from 'lodash/range';
import pick from 'lodash/pick';

import {IWidgetFactoryProps, WidgetFactory} from '../WidgetFactory/WidgetFactory';
import {Col, defaultValue, libOnPropsChanged} from '../../lib';
import {IConfig, IQbUtils} from '../../types';

import styles from './Widget.module.scss';

const QbUtils = Utils as IQbUtils;

const {getFieldConfig, getOperatorConfig, getFieldWidgetConfig} = QbUtils.ConfigUtils;
const {getValueSourcesForFieldOp, getWidgetForFieldOp, getValueLabel} = QbUtils.RuleUtils;
const {createListFromArray} = QbUtils.DefaultUtils;

const funcArgDummyOpDef = {cardinality: 1};

interface IWidget {
    config: IConfig;
    value: ImmutableList<string> | null;
    valueSrc: ImmutableList<ValueSource>;
    valueError: ImmutableList<string>;
    field: string | null;
    operator?: string | null;
    readonly: boolean;
    asyncListValues: unknown[];
    id: string;
    groupId?: string;
    setValue: Function;
    isFuncArg?: boolean;
    fieldFunc?: string;
    fieldArg?: string;
    leftField?: string;
    isForRuleGruop?: boolean;
    parentField?: string | null;
    parentFuncs?: unknown[];
    isCaseValue?: boolean;
    operatorComponent?: React.ReactNode | null;
}

interface IMeta {
    widgets: {
        valueSrc: ValueSource;
        valueLabel: {
            label: string;
        };
        sepText?: string;
    }[];
    iValues: ImmutableList<string> | null;
    aField: unknown;
    defaultWidget: string;
    fieldDefinition: {
        valueSources: unknown[];
        defaultValue: unknown;
        fieldSettings: {
            treeValues: unknown;
            listValues: unknown;
        };
    };
    operatorDefinition: unknown;
    isSpecialRange: unknown;
    cardinality: number;
    valueSources: unknown[];
    asyncListValues: unknown[];
}

export class Widget extends Component<IWidget> {
    meta: IMeta | null;

    constructor(props: IWidget) {
        super(props);
        libOnPropsChanged(this);

        this.meta = this.getMeta(props);
        this.onPropsChanged(props);
    }

    onPropsChanged(nextProps: IWidget) {
        const prevProps = this.props;
        const keysForMeta = [
            'config',
            'field',
            'fieldFunc',
            'fieldArg',
            'leftField',
            'operator',
            'valueSrc',
            'isFuncArg',
            'asyncListValues',
        ];
        const needUpdateMeta =
            !this.meta ||
            keysForMeta
                .map(
                    (k) =>
                        nextProps[k as keyof IWidget] !== prevProps[k as keyof IWidget] ||
                        //tip: for isFuncArg we need to wrap value in Imm list
                        (k == 'isFuncArg' &&
                            nextProps['isFuncArg'] &&
                            nextProps['value'] !== prevProps['value']),
                )
                .filter((ch) => ch).length > 0;

        if (needUpdateMeta) {
            this.meta = this.getMeta(nextProps);
        }
    }

    _setValue = (
        isSpecialRange: unknown,
        delta: number,
        widgetType: unknown,
        value: unknown,
        asyncListValues: unknown,
        __isInternal: unknown,
    ) => {
        if (isSpecialRange && Array.isArray(value) && this.props.value) {
            const oldRange = [this.props.value.get(0), this.props.value.get(1)];
            if (oldRange[0] != value[0])
                this.props.setValue(0, value[0], widgetType, asyncListValues, __isInternal);
            if (oldRange[1] != value[1])
                this.props.setValue(1, value[1], widgetType, asyncListValues, __isInternal);
        } else {
            this.props.setValue(delta, value, widgetType, asyncListValues, __isInternal);
        }
    };

    getMeta({
        config,
        field: simpleField,
        fieldFunc,
        fieldArg,
        operator,
        valueSrc: valueSrcs,
        value: values,
        isForRuleGruop,
        isCaseValue,
        isFuncArg,
        leftField,
        asyncListValues,
    }: IWidget): IMeta | null {
        const field = isFuncArg ? {func: fieldFunc, arg: fieldArg} : simpleField;
        let iValueSrcs = valueSrcs;
        let iValues = values;
        if (isFuncArg || isForRuleGruop || isCaseValue) {
            iValueSrcs = createListFromArray([valueSrcs]);
            iValues = createListFromArray([values]);
        }

        const fieldDefinition = getFieldConfig(config, field as string) as any;
        const defaultWidget = getWidgetForFieldOp(config, field, operator);
        const operatorDefinition = isFuncArg
            ? funcArgDummyOpDef
            : getOperatorConfig(config, operator as string, field as string);
        if ((fieldDefinition == null || operatorDefinition == null) && !isCaseValue) {
            return null;
        }
        let isSpecialRange: unknown;
        if (operatorDefinition && 'isSpecialRange' in operatorDefinition) {
            isSpecialRange = operatorDefinition?.isSpecialRange;
        }

        const isSpecialRangeForSrcField =
            iValueSrcs &&
            isSpecialRange &&
            (iValueSrcs.get(0) == 'field' || iValueSrcs.get(1) == 'field');
        const isTrueSpecialRange = isSpecialRange && !isSpecialRangeForSrcField;
        const cardinality = isTrueSpecialRange
            ? 1
            : defaultValue(operatorDefinition?.cardinality, 1);
        if (cardinality === 0) {
            return null;
        }

        const valueSources = getValueSourcesForFieldOp(
            config,
            field,
            operator,
            fieldDefinition,
            isFuncArg ? leftField : null,
        );

        const widgets = range(0, cardinality).map((delta) => {
            const valueSrc = (iValueSrcs && (iValueSrcs.get(delta) as ValueSource)) || undefined;
            let widget = getWidgetForFieldOp(config, field, operator, valueSrc);
            let widgetDefinition = getFieldWidgetConfig(
                config,
                field as string,
                operator as string,
                widget,
                valueSrc,
            );
            if (
                isSpecialRangeForSrcField &&
                widgetDefinition &&
                'singleWidget' in widgetDefinition
            ) {
                widget = widgetDefinition.singleWidget;
                widgetDefinition = getFieldWidgetConfig(
                    config,
                    field as string,
                    operator as string,
                    widget,
                    valueSrc,
                );
            }
            let widgetType;
            if (widgetDefinition && 'type' in widgetDefinition) {
                widgetType = widgetDefinition?.type;
            }

            const valueLabel = getValueLabel(
                config,
                field,
                operator,
                delta,
                valueSrc,
                isTrueSpecialRange,
            );
            const widgetValueLabel = getValueLabel(
                config,
                field,
                operator,
                delta,
                null,
                isTrueSpecialRange,
            );

            let sepText;
            if (operatorDefinition && 'textSeparators' in operatorDefinition) {
                sepText = (operatorDefinition?.textSeparators as string[])[delta];
            }

            let valueLabels = null;
            let textSeparators = null;
            if (isSpecialRange) {
                valueLabels = [
                    getValueLabel(config, field, operator, 0),
                    getValueLabel(config, field, operator, 1),
                ];
                valueLabels = {
                    placeholder: [valueLabels[0].placeholder, valueLabels[1].placeholder],
                    label: [valueLabels[0].label, valueLabels[1].label],
                };
                if (operatorDefinition && 'textSeparators' in operatorDefinition) {
                    textSeparators = operatorDefinition?.textSeparators;
                }
            }

            const setValueHandler = this._setValue.bind(this, isSpecialRange, delta, widgetType);

            return {
                valueSrc,
                valueLabel,
                widget,
                sepText,
                widgetDefinition,
                widgetValueLabel,
                valueLabels,
                textSeparators,
                setValueHandler,
            };
        });

        return {
            defaultWidget,
            fieldDefinition,
            operatorDefinition,
            isSpecialRange: isTrueSpecialRange,
            cardinality,
            valueSources,
            widgets,
            iValues, //correct for isFuncArg
            aField: field, //correct for isFuncArg
            asyncListValues,
        };
    }

    renderWidget = (delta: number, meta: IMeta, props: IWidget) => {
        const {
            config,
            isFuncArg,
            leftField,
            operator,
            value: values,
            valueError,
            readonly,
            parentField,
            parentFuncs,
            id,
            groupId,
        } = props;
        const {settings} = config;
        const {widgets, iValues, aField} = meta;
        const value = isFuncArg ? iValues : values;
        const field = isFuncArg ? leftField : aField;
        const {valueSrc, valueLabel} = widgets[delta];

        const widgetLabel = settings.showLabels ? (
            <label className="rule--label">{valueLabel.label}</label>
        ) : null;

        return (
            <div
                key={'widget-' + field + '-' + delta}
                className={cn('widget--widget', styles.widget)}
            >
                {valueSrc == 'func' ? null : widgetLabel}
                <WidgetFactory
                    id={id}
                    groupId={groupId}
                    delta={delta}
                    value={value}
                    valueError={valueError}
                    isFuncArg={isFuncArg}
                    {...pick(meta, ['isSpecialRange', 'fieldDefinition', 'asyncListValues'])}
                    {...(pick(widgets[delta], [
                        'widget',
                        'widgetDefinition',
                        'widgetValueLabel',
                        'valueLabels',
                        'textSeparators',
                        'setValueHandler',
                    ]) as {
                        widgetDefinition: IWidgetFactoryProps['widgetDefinition'];
                        widgetValueLabel: IWidgetFactoryProps['widgetValueLabel'];
                        valueLabels: IWidgetFactoryProps['valueLabels'];
                        textSeparators: IWidgetFactoryProps['textSeparators'];
                        setValueHandler: IWidgetFactoryProps['setValueHandler'];
                    })}
                    config={config}
                    field={field as string}
                    parentField={parentField}
                    parentFuncs={parentFuncs}
                    operator={operator}
                    readonly={readonly}
                    operatorComponent={this.props.operatorComponent}
                />
            </div>
        );
    };

    renderSep = (delta: number, meta: IMeta, props: IWidget) => {
        const {config} = props;
        const {widgets} = meta;
        const {settings} = config;
        const {sepText} = widgets[delta];

        const sepLabel = settings.showLabels ? <label className="rule--label">&nbsp;</label> : null;

        return (
            sepText && (
                <div key={'widget-separators-' + delta} className={cn('widget--sep', styles.sep)}>
                    {sepLabel}
                    <span>{sepText}</span>
                </div>
            )
        );
    };

    renderWidgetDelta = (delta: number) => {
        const sep = this.renderSep(delta, this.meta as IMeta, this.props);
        const widgetCmp = this.renderWidget(delta, this.meta as IMeta, this.props);

        return [sep, widgetCmp];
    };

    render() {
        if (!this.meta) return null;
        const {defaultWidget, cardinality} = this.meta;
        if (!defaultWidget) return null;
        const name = defaultWidget;

        return (
            <Col
                className={cn(styles.ruleWidget, styles[`ruleWidget${name.toUpperCase()}`])}
                key={'widget-col-' + name}
            >
                {range(0, cardinality).map(this.renderWidgetDelta)}
            </Col>
        );
    }
}
