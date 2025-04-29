import React from 'react';
import {Config, ImmutableTree} from '@react-awesome-query-builder/core';
import get from 'lodash/get';

import {
    IConfig,
    IGroupedField,
    ITreeNode,
    ItemType,
    RulePosition,
    TField,
    TJsonGroup,
    TJsonItem,
    WidgetTypes,
} from '../types';
import {WIDGET_TYPES} from '../query-builder';
import {Source} from '@/entities/sources/api/fetchers';
import {ONE_SOURCES} from '@/shared/route';

interface IColProps {
    children: React.ReactNode;
    [key: string]: unknown;
}

export const Col: React.FC<IColProps> = ({children, ...props}) => <div {...props}>{children}</div>;

interface IConfirmFnProps {
    [key: string]: unknown;
    config: IConfig;
    confirmFn?: Function | null;
}

export const ConfirmFn =
    (Cmp: React.ComponentType<IConfirmFnProps>): React.FC<IConfirmFnProps> =>
    (props: IConfirmFnProps) => {
        const {useConfirm: confirm} = props.config.settings;
        const confirmFn = confirm ? confirm() : null;
        return <Cmp {...props} confirmFn={confirmFn} />;
    };

export const QueryBuilderHOC =
    <T,>(
        props: (React.Attributes & T) | undefined,
        Component: React.ComponentType<T> | React.FC<T>,
    ): React.Factory<T> =>
    () =>
        props ? <Component {...props} /> : <></>;

function expandPath(arr: string[]): string[] {
    const result: string[] = [];
    for (const elem of arr) {
        result.push('children1');
        result.push(elem);
    }
    return result;
}

function findPosition(id: string, group: ITreeNode) {
    const ruleIds = Object.values(group.children1 || {});

    let ruleIndex = -1;
    let lastGroupIndex = -1;
    let rulesLength = 0;

    for (let i = 0; i < ruleIds.length; i++) {
        const el = ruleIds[i];

        if (el.type === ItemType.rule) {
            rulesLength++;
        } else {
            if (ruleIndex !== -1) break;
            rulesLength = 0;
            lastGroupIndex = i;
        }

        if (el.id === id) {
            ruleIndex = i;
            if (lastGroupIndex != -1) {
                ruleIndex -= lastGroupIndex + 1;
            }
        }
    }

    if (ruleIndex === -1) {
        return undefined;
    }

    const hasPreviousRule = ruleIndex > 0;
    const hasNextRule = ruleIndex < rulesLength - 1;

    if (!hasPreviousRule && !hasNextRule) {
        return RulePosition.only;
    } else if (!hasPreviousRule && hasNextRule) {
        return RulePosition.start;
    } else if (hasPreviousRule && hasNextRule) {
        return RulePosition.middle;
    } else if (hasPreviousRule && !hasNextRule) {
        return RulePosition.end;
    }

    return undefined;
}

export function getRulePosition(path: string[], tree: ImmutableTree) {
    const ruleId = path.slice(-1).join('');
    const groupPath = path.slice(1, -1);
    const expandedGroupPath = expandPath(groupPath);
    const treeJS = tree.toJS();
    const group = get(treeJS, expandedGroupPath) || treeJS;
    return findPosition(ruleId, group);
}

export function getUniqueFieldsRecursively(data: TJsonGroup): string[] {
    const uniqueFields = new Set<string>();

    const traverse = (node: TJsonItem) => {
        if (node.properties && 'field' in node.properties) {
            if (node.properties.field) uniqueFields.add(node.properties.field);
        }

        if ('children1' in node) {
            Object.values(node.children1 || {}).forEach((child) => traverse(child));
        }
    };

    traverse(data);

    return Array.from(uniqueFields);
}

export const getFieldArray = (sources: Source[]) => {
    return sources.flatMap((source) => {
        return (source.attributes || [])
            .map((attr) => {
                const field: TField = {
                    ...attr,
                    group: source.systemName || '',
                    groupLabel: source.name || '',
                    sourceLabel: source.description || '',
                    name: attr.name || '',
                    label: attr.systemName || '',
                    type: String(attr.control?.toLowerCase()),
                    id: `${source.systemName}-${attr.systemName}`,
                    uiPath: ONE_SOURCES(source.id),
                };

                const data: any[] = JSON.parse(attr.allowedValues || '[]');

                if (data.length) {
                    field.fieldSettings = {
                        listValues: (data || []).map((el) => ({
                            value: el.id,
                            title: el.data,
                        })),
                        allowCustomValues: true,
                    };
                }

                return field;
            })
            .filter((attr) => {
                return WIDGET_TYPES.includes(attr.type as WidgetTypes);
            });
    });
};

export const getFieldsByGroup = (sources: Source[]): IGroupedField[] => {
    const fields = getFieldArray(sources);

    return fields.reduce((acc: IGroupedField[], curr) => {
        const groupIndex = acc.findIndex((item) => item.id === curr.group);

        if (groupIndex !== -1) {
            acc[groupIndex].fields.push(curr);
        } else {
            acc.push({
                id: curr.group,
                label: curr.groupLabel,
                sourceLabel: curr.sourceLabel,
                uiPath: curr.uiPath,
                fields: [curr],
            });
        }

        return acc;
    }, []);
};

const extractRules = (children: {[key: string]: TJsonItem}, fields: string[] = []): string[] => {
    for (const child of Object.values(children)) {
        if (child.type === ItemType.rule) {
            if (child.properties.field) {
                fields.push(child.properties.field);
            }
        } else if (
            child.type === ItemType.group &&
            child.children1 &&
            !Array.isArray(child.children1)
        ) {
            extractRules(child.children1, fields);
        }
    }
    return fields;
};

const extractFields = (data: TJsonGroup): string[] => {
    const fields: string[] = [];

    if (data.type === ItemType.group && data.children1 && !Array.isArray(data.children1)) {
        extractRules(data.children1, fields);
    }

    return fields;
};

export const checkHaveAllAttributes = (tjson: TJsonGroup, config: Config) => {
    const usedFields = extractFields(tjson);

    const allFields = Object.keys(config.fields);

    const haveAllAttributes = usedFields.every((el) => allFields.includes(el));

    return haveAllAttributes;
};

const getRulesCountFromGroup = (group: TJsonItem[]): number => {
    let count = 0;

    group.forEach((item) => {
        if (item.type === ItemType.rule) {
            // Игнорируем пустые условия
            if (item.properties.field) {
                count++;
            }
        } else if (item.type === ItemType.group && item.children1) {
            count += getRulesCountFromGroup(
                Array.isArray(item.children1) ? item.children1 : Object.values(item.children1),
            );
        }
    });

    return count;
};

export const getRulesCountFromTree = (tree?: ImmutableTree): number => {
    const group = Object.values(tree?.toJS()?.children1 || {}) as TJsonItem[];
    return getRulesCountFromGroup(group);
};
