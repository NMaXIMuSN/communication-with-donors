import {ConjsProps, CoreConfig, FieldProps, WidgetProps} from '@react-awesome-query-builder/core';
import {isBoolean, isNumber} from 'lodash';

import {QueryBuilderHOC} from '../lib';
import {
    BooleanTrueWidget,
    BooleanWidget,
    CustomConjs,
    CustomOperator,
    DateWidget,
    Gender,
    Number,
    Select,
    Text,
} from '../ui';
import {DataType, IConfig, Operators, WidgetTypes} from '..//types';
import {EGenderValue} from '../ui/qb-widgets/Gender/Gender';

export const getConfig = (): IConfig => {
    const attrErrorMessage = 'Заполните параметры или удалите атрибут';

    return {
        ...CoreConfig,
        types: {
            [DataType.integer]: {
                defaultOperator: Operators.equals,
                widgets: {
                    [WidgetTypes.number]: {
                        operators: [
                            Operators.equals,
                            Operators.gt,
                            Operators.gte,
                            Operators.lt,
                            Operators.lte,
                        ],
                        opProps: {
                            // Решение для переопределения лейблов взято из документации https://github.com/ukrbublik/react-awesome-query-builder/blob/master/CONFIG.adoc#configtypes
                            // @ts-ignore
                            [Operators.gt]: {
                                ...CoreConfig.operators.greater,
                                label: 'Больше',
                            },
                            [Operators.gte]: {
                                label: 'Больше или равно',
                            },
                            [Operators.lt]: {
                                ...CoreConfig.operators.greater,
                                label: 'Меньше',
                            },
                            [Operators.lte]: {
                                label: 'Меньше или равно',
                            },
                        },
                    },
                },
            },
            [DataType.string]: {
                defaultOperator: Operators.in,
                widgets: {
                    [WidgetTypes.text]: {
                        operators: [
                            Operators.equals,
                            Operators.startsWith,
                            Operators.contains,
                            Operators.in,
                            Operators.notIn,
                        ],
                    },
                },
            },
            [DataType.boolean]: {
                ...CoreConfig.types.boolean,
                defaultOperator: Operators.equals,
                widgets: {
                    [WidgetTypes.boolean]: {
                        operators: [Operators.equals, Operators.not],
                    },
                },
            },
            [DataType.date]: {
                ...CoreConfig.types.date,
                defaultOperator: Operators.equals,
                widgets: {
                    [WidgetTypes.date]: {
                        operators: [
                            Operators.equals,
                            Operators.in,
                            Operators.notIn,
                            Operators.lt,
                            Operators.lte,
                            Operators.gt,
                            Operators.gte,
                            Operators.not,
                        ],
                    },
                },
            },
            [DataType.stringSelectize]: {
                ...CoreConfig.types.select,
                valueSources: ['value'],
                defaultOperator: Operators.in,
                widgets: {
                    [WidgetTypes.select]: {
                        operators: [Operators.in, Operators.notIn, Operators.contains],
                    },
                },
            },
        },
        widgets: {
            ...CoreConfig.widgets,
            [WidgetTypes.number]: {
                ...CoreConfig.widgets.number,
                valueSrc: 'value',
                type: WidgetTypes.number,
                valuePlaceholder: 'Значение',
                // @ts-ignore
                factory: (props) => QueryBuilderHOC<WidgetProps>(props, Number)(),
            },
            [WidgetTypes.text]: {
                ...CoreConfig.widgets.text,
                valueSrc: 'value',
                type: WidgetTypes.text,
                valuePlaceholder: 'Значение',
                // @ts-ignore
                factory: (props) => QueryBuilderHOC<WidgetProps>(props, Text)(),
            },
            [WidgetTypes.boolean]: {
                ...CoreConfig.widgets.boolean,
                // @ts-ignore
                defaultValue: true,
                valueSrc: 'value',
                type: WidgetTypes.boolean,
                labelYes: 'Да',
                labelNo: 'Нет',
                // @ts-ignore
                factory: (props) => QueryBuilderHOC<WidgetProps>(props, BooleanWidget)(),
            },
            [WidgetTypes.booleanTrue]: {
                valueSrc: 'value',
                // @ts-ignore
                defaultValue: 'true',
                type: WidgetTypes.booleanTrue,
                labelYes: 'Да',
                labelNo: 'Нет',
                formatValue: (i) => i,
                sqlFormatValue: () => '',
                // @ts-ignore
                factory: (props) => QueryBuilderHOC<WidgetProps>(props, BooleanTrueWidget)(),
            },
            [WidgetTypes.date]: {
                ...CoreConfig.widgets.date,
                type: WidgetTypes.date,
                valuePlaceholder: 'Выберите дату',
                valueLabels: ['Введите дату с', 'Выберите дату по'],
                // @ts-ignore
                factory: (props) => QueryBuilderHOC<WidgetProps>(props, DateWidget)(),
            },
            [WidgetTypes.select]: {
                type: WidgetTypes.select,
                valueSrc: 'value',
                formatValue: (i) => i,
                sqlFormatValue: () => '',
                // @ts-ignore
                factory: (props) => QueryBuilderHOC<WidgetProps>(props, Select)(),
            },
            [WidgetTypes.double]: {
                valuePlaceholder: 'Введите число',
                type: WidgetTypes.double,
                valueSrc: 'value',
                formatValue: (i) => i,
                sqlFormatValue: () => '',
                // @ts-ignore
                factory: (props) => QueryBuilderHOC<WidgetProps>(props, Number)(),
            },
            [WidgetTypes.gender]: {
                // @ts-ignore
                defaultValue: EGenderValue.male,
                labelYes: 'Ж',
                labelNo: 'М',
                valueSrc: 'value',
                type: WidgetTypes.gender,
                formatValue: (i) => i,
                sqlFormatValue: () => '',
                // @ts-ignore
                factory: (props) => QueryBuilderHOC<WidgetProps>(props, Gender)(),
            },
        },
        operators: {
            [Operators.equals]: {
                ...CoreConfig.operators.equal,
                label: 'Равно',
                labelForFormat: '==',
                // @ts-ignore
                validateValues: ([value]) => {
                    if (!isBoolean(value) && !isNumber(value) && !value) return attrErrorMessage;
                    return null;
                },
            },
            [Operators.gt]: {
                ...CoreConfig.operators.greater,
                label: 'После',
                // @ts-ignore
                validateValues: ([value]) => {
                    if (!isBoolean(value) && !isNumber(value) && !value) return attrErrorMessage;
                    return null;
                },
            },
            [Operators.gte]: {
                ...CoreConfig.operators.greater_or_equal,
                label: 'После или равно',
                // @ts-ignore
                validateValues: ([value]) => {
                    if (!isBoolean(value) && !isNumber(value) && !value) return attrErrorMessage;
                    return null;
                },
            },
            [Operators.lt]: {
                ...CoreConfig.operators.less,
                label: 'До',
                // @ts-ignore
                validateValues: ([value]) => {
                    if (!isBoolean(value) && !isNumber(value) && !value) return attrErrorMessage;
                    return null;
                },
            },
            [Operators.lte]: {
                ...CoreConfig.operators.less_or_equal,
                label: 'До или равно',
                // @ts-ignore
                validateValues: ([value]) => {
                    if (!isBoolean(value) && !isNumber(value) && !value) return attrErrorMessage;
                    return null;
                },
            },
            [Operators.startsWith]: {
                ...CoreConfig.operators.starts_with,
                label: 'Начинается с',
                // @ts-ignore
                validateValues: ([value]) => {
                    if (!isBoolean(value) && !value) return attrErrorMessage;
                    return null;
                },
            },
            [Operators.contains]: {
                ...CoreConfig.operators.like,
                label: 'Содержит',
                // @ts-ignore
                validateValues: ([value]) => {
                    if (!isBoolean(value) && !value) return attrErrorMessage;
                    return null;
                },
            },
            [Operators.in]: {
                ...CoreConfig.operators.select_any_in,
                label: 'Из указанных',
                // @ts-ignore
                validateValues: ([value]) => {
                    if (!isBoolean(value) && !value) return attrErrorMessage;
                    return null;
                },
            },
            [Operators.notIn]: {
                ...CoreConfig.operators.select_not_any_in,
                label: 'Не из указанных',
                // @ts-ignore
                validateValues: ([value]) => {
                    if (!isBoolean(value) && !value) return attrErrorMessage;
                    return null;
                },
            },
        },
        fields: {},
        // @ts-ignore
        settings: {
            ...CoreConfig.settings,
            removeEmptyGroupsOnLoad: false,
            removeIncompleteRulesOnLoad: false,
            canLeaveEmptyGroup: false,
            maxNesting: 10,
            showErrorMessage: true,
            addGroupLabel: 'Подгруппа',
            rulePlaceholder: 'Перетащите атрибут из списка слева в эту область',
            ruleErrorLabel: 'Ошибка атрибута, проверьте источник',
            // @ts-ignore
            renderOperator: (props) => QueryBuilderHOC<FieldProps>(props, CustomOperator)(),
            // @ts-ignore
            renderConjs: (props) => QueryBuilderHOC<ConjsProps>(props, CustomConjs)(),
            defaultSliderWidth: '200px',
            defaultSelectWidth: '200px',
            defaultSearchWidth: '100px',
            defaultMaxRows: 5,
            renderSize: 'small',
            maxLabelsLength: 100,
            showLock: false,
            showNot: true,
            forceShowConj: false,
            groupActionsPosition: 'topRight', // oneOf [topLeft, topCenter, topRight, bottomLeft, bottomCenter, bottomRight]
        },
        conjunctions: {
            AND: {
                ...CoreConfig.conjunctions.AND,
                label: 'И',
            },
            OR: {
                ...CoreConfig.conjunctions.OR,
                label: 'ИЛИ',
            },
        },
    };
};
