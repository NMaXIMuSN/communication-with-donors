import {Component, MouseEventHandler, ReactNode} from 'react';
import {
    Actions,
    ConjunctionOption,
    IdPath,
    ImmutableTree,
    TypedMap,
} from '@react-awesome-query-builder/core';
import cn from 'classnames';
import startsWith from 'lodash/startsWith';

import {noop} from 'lodash';
import {DragHandleIcon} from '@/shared/ui/icons';

import {GroupActions} from '../GroupActions/GroupActions';
import GroupContainer from '../GroupContainer/GroupContainer';
import Item from '../Item/Item';
import {Draggable, IDraggable} from '../Draggable/Draggable';
import {ConfirmFn} from '../../lib';
import {IConfig, ItemType} from '../../types';

import styles from './Group.module.scss';
import {Text} from '@gravity-ui/uikit';

const defaultPosition = 'topRight';

export interface IGroup extends IDraggable {
    attrRef: React.MutableRefObject<HTMLDivElement | null>;
    id?: string;
    path: IdPath;
    config: IConfig;
    setLock: Function;
    confirmFn: Function;
    removeSelf: Function;
    removeItemHandler: (id: string) => Promise<boolean>;
    removeSelfHandler: Function;
    conjunctionOptions: TypedMap<ConjunctionOption>;
    children1?: ImmutableTree;
    label?: string;
    setGroupLabel: Function;
    copyRule: Function;
    addRule: Function;
    canRenderAddRuleBtn?: boolean;
    withoutGroupLabel?: boolean;
    addGroup: Function;
    isLocked: boolean;
    allowFurtherNesting: boolean;
    totalRulesCnt: number;
    reordableNodesCnt: number;
    isRoot: unknown;
    actions: Actions;
    selectedConjunction: string;
    setConjunction: (conj: string) => void;
    not: boolean;
    setNot: (not: boolean) => void;
    renderCustomRule?: (props: {
        drag: React.ReactNode | null;
        del: React.ReactNode | null;
        widget: React.ReactNode | null;
        operator: React.ReactNode | null;
    }) => React.ReactNode;
    handleDraggerMouseDown?: MouseEventHandler;
}

class BasicGroup extends Component<IGroup> {
    constructor(props: IGroup) {
        super(props);

        this.removeSelf = this.removeSelf.bind(this);
        this.setLock = this.setLock.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        // При добавлении новой группы в дерево происходили два последовательных обновления: первое — добавление группы, второе — обновление лейбла у группы.
        // Вынос в микротаску позволяет сначала завершить текущее обновление дерева, и только потом применить изменения, связанные с обновлением лейбла
        Promise.resolve().then(() => {
            const label = this.props.label;
            const path = this.props.path;

            if (!label) {
                if (Array.isArray(path)) {
                    this.props.setGroupLabel(path);
                } else {
                    this.props.setGroupLabel(path.toArray());
                }
            }
        });
    }

    isGroupTopPosition() {
        return startsWith(
            this.props.config.settings.groupActionsPosition || defaultPosition,
            'top',
        );
    }

    setLock(lock: unknown) {
        this.props.setLock(lock);
    }

    removeSelf() {
        const {renderConfirm, removeGroupConfirmOptions: confirmOptions} =
            this.props.config.settings;
        const doRemove = () => {
            this.props.removeSelf();
        };
        if (confirmOptions && !this.isEmptyCurrentGroup() && renderConfirm) {
            renderConfirm({
                ...confirmOptions,
                onOk: doRemove,
                okText: '',
                title: '',
            });
        } else {
            doRemove();
        }
    }

    isEmptyCurrentGroup() {
        const children = this.props.children1;
        return (
            !children ||
            children.size == 0 ||
            (children.size == 1 && this.isEmpty(children.first()))
        );
    }

    isEmpty(item: ImmutableTree): boolean {
        const isGroup = item.get('type') == ItemType.group || item.get('type') == 'rule_group';
        return isGroup ? this.isEmptyGroup(item) : this.isEmptyRule(item);
    }

    isEmptyGroup(group: ImmutableTree) {
        const children = group.get('children1');
        return (
            !children ||
            children.size == 0 ||
            (children.size == 1 && this.isEmpty(children.first()))
        );
    }

    isEmptyRule(rule: ImmutableTree) {
        const properties = rule.get('properties');
        return !(
            properties.get('field') !== null &&
            properties.get('operator') !== null &&
            properties.get('value').filter((val: unknown) => val !== undefined).size > 0
        );
    }

    showNot() {
        const {config} = this.props;
        return config.settings.showNot;
    }

    // show conjs for 2+ children?
    showConjs() {
        const {conjunctionOptions} = this.props;
        const conjunctionCount = Object.keys(conjunctionOptions).length;
        return conjunctionCount > 1 || this.showNot();
    }

    isNoChildren() {
        const {children1} = this.props;
        return children1 ? children1.size == 0 : true;
    }

    isOneChild() {
        const {children1} = this.props;
        return children1 ? children1.size < 2 : true;
    }

    renderChildrenWrapper() {
        const {children1} = this.props;
        const childrenCount = children1?.size;
        const showLine = (childrenCount || 0) > 1;

        const isAndConj = this.props.conjunctionOptions?.AND?.checked;

        return (
            children1 && (
                <div
                    key="group-children"
                    className={cn(
                        'group--children',
                        styles.groupChildren,
                        !this.showConjs() ? 'hide--conjs' : '',
                        this.isOneChild() ? 'hide--line' : '',
                        this.isOneChild() ? 'one--child' : '',
                        this.childrenClassName(),
                        {[styles.line]: showLine},
                        {[styles.lineBlue]: showLine && isAndConj},
                    )}
                >
                    {this.renderChildren() as ReactNode}
                </div>
            )
        );
    }

    childrenClassName = () => '';

    renderLabel = () => {
        if (!this.props.label || this.props.withoutGroupLabel) return null;

        return <Text>{this.props.label}</Text>;
    };

    renderHeaderWrapper() {
        const isGroupTopPosition = this.isGroupTopPosition();

        return (
            <div
                key="group-header"
                className={cn(
                    'group--header',
                    styles.header,
                    this.isOneChild() ? 'one--child' : '',
                    !this.showConjs() ? 'hide--conjs' : '',
                    this.isOneChild() ? 'hide--line' : '',
                    this.isNoChildren() ? 'no--children' : '',
                )}
            >
                {this.renderHeader()}
                {this.renderLabel()}
                {isGroupTopPosition && this.renderActions()}
            </div>
        );
    }

    renderFooterWrapper() {
        const isGroupTopPosition = this.isGroupTopPosition();
        return (
            !isGroupTopPosition && (
                <div key="group-footer" className="group--footer">
                    {this.renderActions()}
                </div>
            )
        );
    }

    renderActions() {
        const {
            config,
            addRule,
            addGroup,
            isLocked,
            isTrueLocked,
            id,
            canRenderAddRuleBtn = false,
        } = this.props;

        return (
            <GroupActions
                id={id as string}
                config={config}
                addRule={addRule}
                addGroup={addGroup}
                canAddGroup={this.canAddGroup()}
                canAddRule={canRenderAddRuleBtn && this.canAddRule()}
                canDeleteGroup={this.canDeleteGroup()}
                removeSelf={this.removeSelf}
                setLock={this.setLock}
                isLocked={isLocked}
                isTrueLocked={isTrueLocked}
            />
        );
    }

    canAddGroup() {
        return this.props.allowFurtherNesting;
    }
    canAddRule() {
        const maxNumberOfRules = this.props.config.settings.maxNumberOfRules;
        const totalRulesCnt = this.props.totalRulesCnt;
        if (maxNumberOfRules) {
            return totalRulesCnt < Number(maxNumberOfRules);
        }
        return true;
    }
    canDeleteGroup() {
        return !this.props.isRoot;
    }

    renderChildren() {
        const {children1} = this.props;
        return children1 ? children1.map(this.renderItem).toList() : null;
    }

    renderItem(item: ImmutableTree) {
        const props = this.props;
        const {config, actions, onDragStart, isLocked, setGroupLabel} = props;
        const isRuleGroup =
            item.get('type') == ItemType.group && item.getIn(['properties', 'field']) != null;
        const type = isRuleGroup ? 'rule_group' : item.get('type');

        return (
            <Item
                {...this.extraPropsForItem(item)}
                attrRef={this.props.attrRef}
                key={item.get('id')}
                id={item.get('id')}
                groupId={props.id}
                path={item.get('path')}
                type={type}
                properties={item.get('properties')}
                config={config}
                actions={actions}
                children1={item.get('children1')}
                reordableNodesCnt={this.reordableNodesCntForItem(item)}
                totalRulesCnt={this.totalRulesCntForItem(item)}
                parentReordableNodesCnt={this.reordableNodesCnt()}
                onDragStart={onDragStart}
                isDraggingTempo={this.props.isDraggingTempo}
                isParentLocked={isLocked}
                label={item.get('label')}
                setGroupLabel={item.get('type') === ItemType.group ? setGroupLabel : noop}
                copyRule={this.props.copyRule}
                removeSelfHandler={this.props.removeSelfHandler}
                removeItemHandler={this.props.removeItemHandler}
                renderCustomRule={this.props.renderCustomRule}
                canRenderAddRuleBtn={this.props.canRenderAddRuleBtn}
                withoutGroupLabel={this.props.withoutGroupLabel}
            />
        );
    }

    extraPropsForItem(_item: ImmutableTree) {
        return {};
    }

    reordableNodesCnt() {
        if (this.props.isLocked) return 0;
        return this.props.reordableNodesCnt;
    }

    totalRulesCntForItem(_item: ImmutableTree) {
        return this.props.totalRulesCnt;
    }

    reordableNodesCntForItem(_item: ImmutableTree) {
        if (this.props.isLocked) return 0;
        return this.reordableNodesCnt();
    }

    showDragIcon() {
        const {config, isRoot, isLocked} = this.props;
        const reordableNodesCnt = this.reordableNodesCnt();
        return config.settings.canReorder && !isRoot && reordableNodesCnt > 1 && !isLocked;
    }

    renderDrag() {
        const {handleDraggerMouseDown} = this.props;

        return (
            this.showDragIcon() && (
                <div
                    key="group-drag-icon"
                    onMouseDown={handleDraggerMouseDown}
                    className={cn('qb-drag-handler group--drag-handler', styles.dragIcon)}
                >
                    <DragHandleIcon className={styles.icon} />
                </div>
            )
        );
    }

    conjunctionOptions() {
        const {conjunctionOptions} = this.props;
        return conjunctionOptions;
    }

    renderConjs() {
        const {config, children1, id, selectedConjunction, setConjunction, not, setNot, isLocked} =
            this.props;

        const {immutableGroupsMode, renderConjs: Conjs, notLabel} = config.settings;
        const conjunctionOptions = this.conjunctionOptions();
        if (!this.showConjs() || !Conjs || !id || !selectedConjunction) return null;
        if (!children1 || !children1.size) return null;

        const renderProps = {
            disabled: this.isOneChild(),
            readonly: immutableGroupsMode || isLocked,
            selectedConjunction: selectedConjunction,
            setConjunction: immutableGroupsMode ? noop : setConjunction,
            conjunctionOptions: conjunctionOptions,
            config: config,
            not: not || false,
            id: id,
            setNot: immutableGroupsMode ? noop : setNot,
            notLabel: notLabel,
            showNot: this.showNot(),
            isLocked: isLocked,
        };
        // @ts-ignore
        return <Conjs {...renderProps} />;
    }

    renderHeader() {
        return (
            <div className={styles.groupConjunctions}>
                {this.renderDrag()}
                {this.renderConjs()}
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderHeaderWrapper()}
                {this.renderChildrenWrapper()}
                {this.renderFooterWrapper()}
            </div>
        );
    }
}

export default GroupContainer(
    Draggable(cn(ItemType.group, styles.group))(ConfirmFn(BasicGroup as any) as any),
);
