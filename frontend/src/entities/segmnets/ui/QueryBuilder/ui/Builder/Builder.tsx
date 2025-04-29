import {Component} from 'react';
import {Actions, Config, ImmutableTree, Utils} from '@react-awesome-query-builder/core';
import cn from 'classnames';

import SortableContainer from '../SortableContainer/SortableContainer';
import {IQbUtils, IdPath} from '../../types';
import {pureShouldComponentUpdate} from '../../lib';
import {IList} from '../List/List';
import {IItem} from '../Item/Item';
import {TQueryBuilderChildrenFn} from '../../QueryBuilder';

import styles from './Builder.module.scss';

const QbUtils = Utils as IQbUtils;

const {getTotalReordableNodesCountInTree, getTotalRulesCountInTree} = QbUtils.TreeUtils;
const {createListFromArray, emptyProperies} = QbUtils.DefaultUtils;

export interface IBuilder {
    children: TQueryBuilderChildrenFn;
    tree: ImmutableTree;
    config: Config;
    actions: Actions;
    onDragStart?: (id: string, dom: HTMLElement, e: MouseEvent) => void;
    onItemClick?: (field: string) => void;
    setGroupLabel: (path: string[], label?: string) => void;
    copyRule: (path: string[]) => void;
    removeSelfHandler: (parent: IdPath) => void;
    removeItemHandler?: (id: string) => Promise<boolean>;
    attrRef: React.MutableRefObject<HTMLDivElement | null>;
    __isInternalValueChange?: unknown;
}

class Builder extends Component<IBuilder> {
    pureShouldComponentUpdate: Function;
    path: IdPath;

    constructor(props: IBuilder) {
        super(props);
        this.pureShouldComponentUpdate = pureShouldComponentUpdate(this);

        this.path = [];
        this._updPath(props);
    }

    shouldComponentUpdate(nextProps: {[key: string]: unknown}, nextState: unknown) {
        const prevProps = this.props as {[key: string]: unknown};

        let should = this.pureShouldComponentUpdate(nextProps, nextState);
        if (should) {
            const chs = [];
            for (const k in nextProps) {
                const changed = nextProps[k] !== prevProps[k];
                if (changed && k != '__isInternalValueChange') {
                    chs.push(k);
                }
            }
            if (!chs.length) should = false;
            //optimize render
            if (chs.length == 1 && chs[0] == 'tree' && nextProps.__isInternalValueChange)
                should = false;
        }
        return should;
    }

    _updPath(props: IBuilder) {
        const id = props.tree.get('id');
        this.path = createListFromArray([id]);
    }

    render() {
        const tree = this.props.tree;
        const rootType = tree.get('type');
        const isTernary = rootType == 'switch_group';
        const reordableNodesCnt = isTernary ? null : getTotalReordableNodesCountInTree(tree);
        const totalRulesCnt = isTernary ? null : getTotalRulesCountInTree(tree);
        const id = tree.get('id');

        const listProps: IList = {
            attrRef: this.props.attrRef,
            onDragStart: this.props.onDragStart,
            onItemClick: this.props.onItemClick,
            isLocked: tree.get('properties')?.get('isLocked') || false,
        };

        const itemsTreeProps: IItem = {
            attrRef: this.props.attrRef,
            id: id,
            path: this.path,
            type: rootType,
            properties: tree.get('properties') || emptyProperies(),
            config: this.props.config,
            actions: this.props.actions,
            children1: tree.get('children1') || emptyProperies(),
            reordableNodesCnt: reordableNodesCnt,
            totalRulesCnt: totalRulesCnt,
            parentReordableNodesCnt: 0,
            onDragStart: this.props.onDragStart,
            setGroupLabel: this.props.setGroupLabel,
            copyRule: this.props.copyRule,
            removeSelfHandler: this.props.removeSelfHandler,
            removeItemHandler: this.props.removeItemHandler,
            label: tree.get('label'),
        };

        return (
            <div className={cn('query-builder-container', styles.wrapper)}>
                <div
                    className={cn('query-builder qb-lite', styles.builder)}
                    ref={this.props.attrRef}
                >
                    {this.props.children({listProps, itemsTreeProps})}
                </div>
            </div>
        );
    }
}

export default SortableContainer(Builder);
