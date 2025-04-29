import {Component} from 'react';
import {Actions, ConjunctionOption, TypedMap, Utils} from '@react-awesome-query-builder/core';
import mapValues from 'lodash/mapValues';
import {createPortal} from 'react-dom';
import cn from 'classnames';

import {noop} from 'lodash';

import {IGroup} from '../Group/Group';
import {connect, libOnPropsChanged, pureShouldComponentUpdate} from '../../lib';
import {IDrag, IQbUtils, IdPath} from '../../types';
import {Context, IContext, IContextState} from '../../context';

import styles from './GroupContainer.module.scss';

const QbUtils = Utils as IQbUtils;

const {defaultGroupConjunction} = QbUtils.DefaultUtils;

interface IGroupContainer extends IGroup {
    actions: Actions;
    conjunction: unknown;
    field: string;
    path: IdPath;
    groupId: string;
    value: unknown;
    dragging: IDrag;
}

const createGroupContainer = (
    Group: React.ComponentType<IGroup>,
): React.ComponentType<IGroupContainer> =>
    class GroupContainer extends Component<IGroupContainer> {
        pureShouldComponentUpdate: Function;
        selectedConjunction: string;
        conjunctionOptions: TypedMap<ConjunctionOption>;

        constructor(props: IGroupContainer) {
            super(props);
            this.pureShouldComponentUpdate = pureShouldComponentUpdate(this);
            libOnPropsChanged(this);

            this.selectedConjunction = this._selectedConjunction(props);
            this.conjunctionOptions = this._getConjunctionOptions(props);
        }

        shouldComponentUpdate(nextProps: {[key: string]: unknown}, nextState: unknown) {
            const prevProps = this.props;
            const prevState = this.state;

            let should = this.pureShouldComponentUpdate(nextProps, nextState);
            if (should) {
                if (prevState == nextState && prevProps != nextProps) {
                    const draggingId =
                        (nextProps.dragging as {id: string}).id || prevProps.dragging.id;
                    const isDraggingMe = draggingId == nextProps.id;
                    const chs = [];
                    for (const k in nextProps) {
                        let changed =
                            (nextProps as {[key: string]: unknown})[k] !=
                            (prevProps as {[key: string]: unknown})[k];
                        if (k == 'dragging' && !isDraggingMe) {
                            changed = false; //dragging another item -> ignore
                        }
                        if (changed) {
                            chs.push(k);
                        }
                    }
                    if (!chs.length) should = false;
                }
            }
            return should;
        }

        onPropsChanged(nextProps: IGroupContainer) {
            const {config, conjunction} = nextProps;
            const oldConfig = this.props.config;
            const oldConjunction = this.props.conjunction;
            if (oldConfig != config || oldConjunction != conjunction) {
                this.selectedConjunction = this._selectedConjunction(nextProps);
                this.conjunctionOptions = this._getConjunctionOptions(nextProps);
            }
        }

        _getConjunctionOptions(props: IGroupContainer) {
            return mapValues(props.config.conjunctions, (item, index) => ({
                id: `conjunction-${props.id}-${index}`,
                name: `conjunction[${props.id}]`,
                key: index,
                label: item.label,
                checked: index === this._selectedConjunction(props),
            }));
        }

        _selectedConjunction = (props: IGroupContainer) => {
            props = props || this.props;
            return props.conjunction || defaultGroupConjunction(props.config, props.field);
        };

        setConjunction = (conj: string) => {
            this.props.actions.setConjunction(this.props.path, conj);
        };

        setNot = (not: boolean) => {
            this.props.actions.setNot(this.props.path, not);
        };

        setLock = (lock: boolean) => {
            this.props.actions.setLock(this.props.path, lock);
        };

        removeSelf = async () => {
            const canDelete =
                (this.props.id && (await this.props?.removeItemHandler?.(this.props.id))) ?? true;

            if (canDelete) this.props.actions.removeGroup(this.props.path);
        };

        addGroup = () => {
            this.props.actions.addGroup(this.props.path);
        };

        addRule = () => {
            this.props.actions.addRule(this.props.path);
        };

        // for RuleGroup
        setField = (field: string) => {
            this.props.actions.setField(this.props.path, field);
        };

        // for RuleGroupExt
        setOperator = (operator: string) => {
            this.props.actions.setOperator(this.props.path, operator);
        };

        setValue = (delta: number, value: unknown, type: string) => {
            this.props.actions.setValue(this.props.path, delta, value, type);
        };

        render() {
            const isDraggingMe = Boolean(
                this.props.id && this.props.dragging.id && this.props.dragging.id == this.props.id,
            );

            const currentNesting = Array.isArray(this.props.path)
                ? this.props.path.length
                : this.props.path?.size;
            const maxNesting = this.props.config.settings.maxNesting;
            const maxRulesCount = this.props.config.settings.maxNumberOfRules;
            const isInDraggingTempo = !isDraggingMe && this.props.isDraggingTempo;
            const totalRulesCnt = this.props.totalRulesCnt;

            const dragging = this.props.dragging;

            let stylesDrag = {};

            if (isDraggingMe && dragging) {
                stylesDrag = {
                    top: dragging.y,
                    left: dragging.x,
                };
            }

            // Don't allow nesting further than the maximum configured depth and don't
            // allow removal of the root group.
            // и если достигнуто максимальное количество правил
            const allowFurtherNesting =
                (typeof maxNesting === 'undefined' || currentNesting < maxNesting) &&
                (typeof maxRulesCount === 'undefined' || totalRulesCnt < Number(maxRulesCount));
            const isRoot = currentNesting == 1;

            return (
                <div
                    className={cn('group-or-rule-container group-container', styles.groupContainer)}
                    data-id={this.props.id}
                >
                    {isDraggingMe &&
                        this.props.attrRef?.current &&
                        createPortal(
                            <div className={cn('group-or-rule', 'qb-draggable')} style={stylesDrag}>
                                {this.props.label}
                            </div>,
                            this.props.attrRef.current,
                        )}
                    <Group
                        attrRef={this.props.attrRef}
                        key={this.props.id}
                        id={this.props.id}
                        path={this.props.path}
                        isDraggingMe={isDraggingMe}
                        isDraggingTempo={isInDraggingTempo}
                        dragging={this.props.dragging}
                        onDragStart={this.props.onDragStart}
                        isRoot={isRoot}
                        allowFurtherNesting={allowFurtherNesting}
                        conjunctionOptions={this.conjunctionOptions}
                        not={this.props.not}
                        selectedConjunction={this.selectedConjunction}
                        setConjunction={isInDraggingTempo ? noop : this.setConjunction}
                        setNot={isInDraggingTempo ? noop : this.setNot}
                        setLock={isInDraggingTempo ? noop : this.setLock}
                        removeSelf={isInDraggingTempo ? noop : this.removeSelf}
                        removeSelfHandler={this.props.removeSelfHandler}
                        removeItemHandler={this.props.removeItemHandler}
                        addGroup={isInDraggingTempo ? noop : this.addGroup}
                        addRule={isInDraggingTempo ? noop : this.addRule}
                        config={this.props.config}
                        children1={this.props.children1}
                        actions={this.props.actions}
                        reordableNodesCnt={this.props.reordableNodesCnt}
                        totalRulesCnt={this.props.totalRulesCnt}
                        isLocked={this.props.isLocked}
                        isTrueLocked={this.props.isTrueLocked}
                        confirmFn={noop}
                        label={this.props.label}
                        setGroupLabel={this.props.setGroupLabel}
                        withoutGroupLabel={this.props.withoutGroupLabel}
                        copyRule={this.props.copyRule}
                        canRenderAddRuleBtn={this.props.canRenderAddRuleBtn}
                        renderCustomRule={this.props.renderCustomRule}
                    />
                </div>
            );
        }
    };

export default (Group: React.ComponentType<IGroup>) => {
    const ConnectedGroupContainer = connect<IContext, IGroupContainer, IContextState>(
        (state) => {
            return {
                dragging: state.dragging,
            };
        },
        null,
        Context,
    )(createGroupContainer(Group));

    ConnectedGroupContainer.displayName = 'ConnectedGroupContainer';

    return ConnectedGroupContainer;
};
