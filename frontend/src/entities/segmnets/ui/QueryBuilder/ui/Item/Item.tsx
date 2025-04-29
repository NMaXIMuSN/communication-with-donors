import React from 'react';
import {Actions, Config, ItemProperties} from '@react-awesome-query-builder/core';

import {Group, Rule} from '..';
import {ItemType} from '../../types';

type TItemProperties = ItemProperties & {
    toObject: Function;
};

export interface IItem {
    attrRef: React.MutableRefObject<HTMLDivElement | null>;
    config: Config;
    id: string;
    groupId?: string;
    type: ItemType;
    path: unknown;
    properties: TItemProperties;
    children1?: unknown;
    actions: Actions;
    reordableNodesCnt?: number;
    onDragStart?: Function | null;
    parentField?: string;
    isDraggingMe?: boolean;
    isDraggingTempo?: boolean;
    isParentLocked?: boolean;
    totalRulesCnt: number;
    parentReordableNodesCnt: number;
    setGroupLabel: Function;
    copyRule?: Function;
    removeSelfHandler?: Function;
    canRenderAddRuleBtn?: boolean;
    removeItemHandler?: (id: string) => Promise<boolean>;
    renderCustomRule?: (props: {
        drag: React.ReactNode | null;
        del: React.ReactNode | null;
        widget: React.ReactNode | null;
        operator: React.ReactNode | null;
    }) => React.ReactNode;
    label?: string;
    withoutGroupLabel?: boolean;
    data?: {
        importAttrName?: string;
        importGroupName?: string;
    };
}

type ItemPropsWithoutType = Omit<IItem, 'type'>;

const getProperties = (props: ItemPropsWithoutType) => {
    const properties = props.properties?.toObject() || {};

    const result = {
        ...properties,
        selectedField: properties.field,
        selectedOperator: properties.operator,
    };
    if (props.isParentLocked) {
        result.isLocked = true;
    }
    if (properties.isLocked) {
        result.isTrueLocked = true;
    }
    if (properties.data) {
        result.ruleData = properties.data?.toObject() || {};
    }
    return result;
};

const typeMap: {[key: string]: React.FC<ItemPropsWithoutType>} = {
    rule: (props) => {
        return (
            <Rule
                {...getProperties(props)}
                renderCustomRule={props.renderCustomRule}
                attrRef={props.attrRef}
                id={props.id}
                key={props.id}
                isDraggingTempo={props.isDraggingTempo}
                groupId={props.groupId}
                path={props.path}
                actions={props.actions}
                reordableNodesCnt={props.reordableNodesCnt}
                totalRulesCnt={props.totalRulesCnt}
                config={props.config}
                onDragStart={props.onDragStart}
                copyRule={props.copyRule}
                removeSelfHandler={props.removeSelfHandler}
                removeItemHandler={props.removeItemHandler}
                parentField={props.parentField}
                parentReordableNodesCnt={props.parentReordableNodesCnt}
            />
        );
    },
    group: (props) => {
        return (
            <Group
                {...getProperties(props)}
                canRenderAddRuleBtn={props.canRenderAddRuleBtn}
                renderCustomRule={props.renderCustomRule}
                attrRef={props.attrRef}
                id={props.id}
                key={props.id}
                groupId={props.groupId}
                path={props.path}
                actions={props.actions}
                config={props.config}
                reordableNodesCnt={props.reordableNodesCnt}
                totalRulesCnt={props.totalRulesCnt}
                onDragStart={props.onDragStart}
                isDraggingTempo={props.isDraggingTempo}
                children1={props.children1}
                parentField={null}
                parentReordableNodesCnt={props.parentReordableNodesCnt}
                label={props.label}
                setGroupLabel={props.setGroupLabel}
                withoutGroupLabel={props.withoutGroupLabel}
                copyRule={props.copyRule}
                removeSelfHandler={props.removeSelfHandler}
                removeItemHandler={props.removeItemHandler}
            />
        );
    },
};

const Item: React.FC<IItem> = ({type, ...props}) => {
    const Cmp = typeMap[type];

    if (!Cmp) return null;

    return Cmp(props);
};

export default React.memo(Item);
