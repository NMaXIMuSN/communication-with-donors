import {Component} from 'react';
import cn from 'classnames';
import {Actions, ImmutableTree, ValueSource} from '@react-awesome-query-builder/core';
import {createPortal} from 'react-dom';

import {noop} from 'lodash';

import {IRule} from '../Rule/Rule';
import {Context, IContext, IContextState} from '../../context';
import {connect, getRulePosition, pureShouldComponentUpdate} from '../../lib';
import {IdPath} from '../../types';

import styles from './RuleContainer.module.scss';

interface IRuleContainer extends IRule {
    actions: Actions;
    path: IdPath;
    tree: ImmutableTree;
    removeSelfHandler: Function;
    removeItemHandler?: (id: string) => Promise<boolean>;
}

const createRuleContainer = (
    Rule: React.ComponentType<IRule>,
): React.ComponentType<IRuleContainer> =>
    class RuleContainer extends Component<IRuleContainer> {
        pureShouldComponentUpdate: Function;

        constructor(props: IRuleContainer) {
            super(props);
            this.pureShouldComponentUpdate = pureShouldComponentUpdate(this);
        }

        removeSelf = async () => {
            const canDelete = (await this.props?.removeItemHandler?.(this.props.id)) ?? true;

            if (canDelete) {
                this.props.removeSelfHandler(this.props.path);
                this.props.actions.removeRule(this.props.path);
            }
        };

        setLock = (lock = false) => {
            this.props.actions.setLock(this.props.path, lock);
        };

        setField = (field: string) => {
            this.props.actions.setField(this.props.path, field);
        };

        setOperator = (operator: string) => {
            this.props.actions.setOperator(this.props.path, operator);
        };

        setOperatorOption = (name: string, value: unknown) => {
            this.props.actions.setOperatorOption(this.props.path, name, value);
        };

        setValue = (delta: number, value: unknown, type: string) => {
            this.props.actions.setValue(this.props.path, delta, value, type);
        };

        setValueSrc = (delta: number, srcKey: ValueSource) => {
            this.props.actions.setValueSrc(this.props.path, delta, srcKey);
        };

        copyRule = () => {
            this.props.copyRule(this.props.path);
        };

        shouldComponentUpdate(nextProps: IRuleContainer, nextState: unknown) {
            const prevProps: IRuleContainer = this.props;
            const prevState = this.state;

            let should = this.pureShouldComponentUpdate(nextProps, nextState);
            if (should) {
                if (prevState === nextState && prevProps !== nextProps) {
                    const draggingId = nextProps.dragging.id || prevProps.dragging.id;

                    const isDraggingMe = draggingId === nextProps.id;
                    const chs: string[] = [];
                    for (const k in nextProps) {
                        if (Object.prototype.hasOwnProperty.call(nextProps, k)) {
                            let changed = (nextProps as any)[k] !== (prevProps as any)[k];
                            if (k === 'dragging' && !isDraggingMe) {
                                changed = false; //dragging another item -> ignore
                            }
                            if (changed) {
                                chs.push(k);
                            }
                        }
                    }
                    if (!chs.length) should = false;
                }
            }
            return should;
        }

        render() {
            const {id, dragging, isDraggingTempo, path, tree, selectedField, config, attrRef} =
                this.props;

            const isDraggingMe = Boolean(id && dragging.id && dragging.id == id);

            const isInDraggingTempo = !isDraggingMe && isDraggingTempo;

            const pathArray = Array.isArray(path) ? path : path.toArray();

            const position = getRulePosition(pathArray, tree);

            let stylesDrag = {};

            if (isDraggingMe && dragging) {
                stylesDrag = {
                    top: dragging.y,
                    left: dragging.x,
                };
            }

            const label = selectedField
                ? config.fields[selectedField]?.label ||
                  (config.fields[selectedField] as {name?: string})?.name
                : selectedField;

            return (
                <>
                    {isDraggingMe &&
                        attrRef?.current &&
                        createPortal(
                            <div className={cn('group-or-rule', 'qb-draggable')} style={stylesDrag}>
                                {label}
                            </div>,
                            attrRef.current,
                        )}
                    <div
                        className={cn(
                            'group-or-rule-container',
                            'rule-container',
                            styles.ruleContainer,
                            styles.border,
                            {
                                [styles[`border${position}`]]: position,
                            },
                        )}
                        data-id={this.props.id}
                    >
                        <Rule
                            attrRef={this.props.attrRef}
                            key={this.props.id}
                            id={this.props.id}
                            groupId={this.props.groupId}
                            isDraggingMe={isDraggingMe}
                            isDraggingTempo={isInDraggingTempo}
                            dragging={this.props.dragging}
                            onDragStart={this.props.onDragStart}
                            setLock={isInDraggingTempo ? noop : this.setLock}
                            removeSelf={isInDraggingTempo ? noop : this.removeSelf}
                            setField={isInDraggingTempo ? noop : this.setField}
                            setOperator={isInDraggingTempo ? noop : this.setOperator}
                            setOperatorOption={isInDraggingTempo ? noop : this.setOperatorOption}
                            setValue={isInDraggingTempo ? noop : this.setValue}
                            setValueSrc={isInDraggingTempo ? noop : this.setValueSrc}
                            selectedField={this.props.field || null}
                            parentField={this.props.parentField || null}
                            selectedOperator={this.props.operator || null}
                            value={this.props.value || null}
                            valueSrc={this.props.valueSrc || null}
                            valueError={this.props.valueError || null}
                            operatorOptions={this.props.operatorOptions}
                            config={this.props.config}
                            reordableNodesCnt={this.props.reordableNodesCnt}
                            totalRulesCnt={this.props.totalRulesCnt}
                            asyncListValues={this.props.asyncListValues}
                            isLocked={this.props.isLocked}
                            isTrueLocked={this.props.isTrueLocked}
                            parentReordableNodesCnt={this.props.parentReordableNodesCnt}
                            copyRule={this.copyRule}
                            ruleData={this.props.ruleData}
                            renderCustomRule={this.props.renderCustomRule}
                        />
                    </div>
                </>
            );
        }
    };

export const RuleContainer = (Rule: React.ComponentType<IRule>) => {
    const ConnectedRule = createRuleContainer(Rule);

    const ConnectedRuleContainer = connect<IContext, IRuleContainer, IContextState>(
        (state) => {
            return {
                tree: state.tree,
                dragging: state.dragging,
            };
        },
        null,
        Context,
    )(ConnectedRule);

    ConnectedRuleContainer.displayName = 'ConnectedRuleContainer';

    return ConnectedRuleContainer;
};
