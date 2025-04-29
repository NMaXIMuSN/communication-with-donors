import {Utils as QbUtils} from '@react-awesome-query-builder/core';

import {ItemType, TJsonGroup, WidgetTypes} from './types';

export const constants = {
    ADD_GROUP: 'ADD_GROUP',
    ADD_CASE_GROUP: 'ADD_CASE_GROUP',
    REMOVE_GROUP: 'REMOVE_GROUP',
    SET_CONJUNCTION: 'SET_CONJUNCTION',
    SET_NOT: 'SET_NOT',
    ADD_RULE: 'ADD_RULE',
    REMOVE_RULE: 'REMOVE_RULE',
    SET_FIELD: 'SET_FIELD',
    SET_OPERATOR: 'SET_OPERATOR',
    SET_VALUE: 'SET_VALUE',
    SET_VALUE_SRC: 'SET_VALUE_SRC',
    SET_OPERATOR_OPTION: 'SET_OPERATOR_OPTION',
    SET_LOCK: 'SET_LOCK',

    SET_TREE: 'SET_TREE',

    MOVE_ITEM: 'MOVE_ITEM',

    PLACEMENT_AFTER: 'after',
    PLACEMENT_BEFORE: 'before',
    PLACEMENT_APPEND: 'append',
    PLACEMENT_PREPEND: 'prepend',

    SET_DRAG_PROGRESS: 'SET_DRAG_PROGRESS',
    SET_DRAG_START: 'SET_DRAG_START',
    SET_DRAG_END: 'SET_DRAG_END',
};

export const WIDGET_TYPES = Object.values(WidgetTypes);

export const INITIAL_QUERY_VALUE = (): TJsonGroup => {
    return {
        id: QbUtils.uuid(),
        type: ItemType.group,
        label: 'Группа 1',
        properties: {
            conjunction: 'AND',
            not: false,
        },
        children1: [
            {
                id: QbUtils.uuid(),
                type: ItemType.rule,
                properties: {
                    field: null,
                    operator: null,
                    value: ['value'],
                    valueSrc: [],
                    valueError: [],
                    valueType: [],
                },
            },
        ],
    };
};
