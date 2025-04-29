import {Utils as QbUtils} from '@react-awesome-query-builder/core';

import {
    DataType,
    ItemType,
    RuleValue,
    TField,
    TJsonGroup,
    TJsonRule,
    WidgetTypes,
} from './../types';

interface IQueryBuilderRule {
    id: string;
    field: string;
    type: string;
    operator: string;
    value: RuleValue;
    data: any;
}

export interface IQueryBuilderGroup {
    not: boolean;
    rules: Array<IQueryBuilderRule | IQueryBuilderGroup>;
    condition: string;
}

function convertRule(rule: IQueryBuilderRule, fields: {[key: string]: TField}): TJsonRule {
    const ruleTemp = {
        id: QbUtils.uuid(),
        type: ItemType.rule,
        properties: {
            field: rule.field || '',
            operator: rule.operator || '',
            value: [rule.value],
            valueSrc: ['value'],
            valueError: [],
            valueType:
                rule.operator === 'between'
                    ? [rule?.type?.toLowerCase(), rule?.type?.toLowerCase()]
                    : [rule?.type?.toLowerCase()],
            data: {
                importAttrName: rule.data.importAttrName,
                importGroupName: rule.data.importGroupName,
            },
        },
    };

    if (rule.type === WidgetTypes.date) {
        if (Array.isArray(rule.value)) {
            ruleTemp.properties.value = rule.value;
        } else {
            ruleTemp.properties.value = [rule.value];
        }
    }

    const type = fields[rule.field]?.controlName?.toLowerCase() as WidgetTypes;

    if (type) {
        ruleTemp.properties.valueType = [type];
    }

    return ruleTemp as TJsonRule;
}

function convertGroup(group: IQueryBuilderGroup, fields: {[key: string]: TField}): TJsonGroup {
    return {
        id: QbUtils.uuid(),
        type: ItemType.group,
        properties: {
            conjunction: group.condition,
            not: group.not,
        },
        children1: group.rules.map((item) => {
            if ('id' in item) {
                return convertRule(item, fields);
            } else {
                return convertGroup(item, fields);
            }
        }),
    };
}

export function convertQueryBuilderToTJson(
    queryBuilder: IQueryBuilderGroup,
    fields: {[key: string]: TField},
): TJsonGroup {
    return convertGroup(queryBuilder, fields);
}

function convertTJsonToRule(
    tjsonRule: TJsonRule,
    fields: {[key: string]: TField},
): IQueryBuilderRule {
    const value = tjsonRule.properties.value;
    const valueType = tjsonRule.properties.valueType
        ? tjsonRule.properties.valueType[0]
        : 'undefined';

    const formattedRule = {
        id: tjsonRule.properties.field || '',
        field: tjsonRule.properties.field || '',
        type: valueType,
        operator: tjsonRule.properties.operator || '',
        value: value[0],
        data: {
            importAttrName: fields[tjsonRule.properties.field || '']?.name,
            importGroupName: fields[tjsonRule.properties.field || '']?.groupLabel,
        },
    };

    switch (valueType) {
        case DataType.integer:
            formattedRule.value = Number(value[0]);
            break;
        case DataType.boolean:
            formattedRule.type = DataType.boolean;
            break;
        case DataType.date:
        case DataType.dateNow:
            formattedRule.value = value.length > 1 ? value : value[0];
            formattedRule.type = WidgetTypes.date;
            break;
        case DataType.stringSelectize:
            formattedRule.type = WidgetTypes.select;
            break;

        default:
            formattedRule.type = WidgetTypes.text;
            break;
    }

    return formattedRule;
}

function convertTJsonToGroup(
    tjsonGroup: TJsonGroup,
    fields: {[key: string]: TField},
): IQueryBuilderGroup | undefined {
    const rules: Array<IQueryBuilderRule | IQueryBuilderGroup> = [];

    if (tjsonGroup.children1 && !Array.isArray(tjsonGroup.children1)) {
        const childs = Object.values(tjsonGroup.children1);

        if (childs.length) {
            for (const child of childs) {
                if (Array.isArray(child)) continue;

                if (child.type === ItemType.rule) {
                    const convertedRule = convertTJsonToRule(child, fields);
                    if (convertedRule.field && convertedRule.operator !== undefined) {
                        rules.push(convertedRule);
                    }
                } else if (child.type === ItemType.group) {
                    const convertedGroup = convertTJsonToGroup(child, fields);
                    if (convertedGroup && convertedGroup.rules.length) rules.push(convertedGroup);
                }
            }
        }
    }

    if (!rules.length || (rules.length && 'id' in rules[0] && !rules[0].id)) return;

    return {
        not: tjsonGroup.properties?.not || false,
        rules,
        condition: tjsonGroup.properties?.conjunction || '',
    };
}

export function convertTJsonToQueryBuilder(
    tjson: TJsonGroup,
    fields: {[key: string]: TField},
): IQueryBuilderGroup | undefined {
    return convertTJsonToGroup(tjson, fields);
}
