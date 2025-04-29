import {Component} from 'react';
import {ImmutableTree} from '@react-awesome-query-builder/core';

import {
    actions,
    bindActionCreators,
    connect,
    immutableEqual,
    liteShouldComponentUpdate,
} from '../../lib';
import {Context, IContext, IContextState} from '../../context';
import {IConfig} from '../../types';
import Builder from '../Builder/Builder';
import {TQueryBuilderChildrenFn} from '../../QueryBuilder';
import {ISortableContainer} from '../SortableContainer/SortableContainer';

interface IQuery {
    children?: TQueryBuilderChildrenFn;
    renderBuilder?: Function;
    sourceLoaded: boolean;
    config: IConfig;
    onChange: Function;
    getMemoizedTree: Function;
    tree?: ImmutableTree;
    dispatch?: unknown;
    __lastAction?: unknown;
    __isInternalValueChange?: unknown;
}

class Query extends Component<IQuery> {
    static contextType = Context;
    validatedTree?: ImmutableTree;
    oldValidatedTree?: ImmutableTree;
    actions: object;

    constructor(props: IQuery) {
        super(props);

        this.actions = {tree: undefined, group: undefined, rule: undefined};
        this._updateActions(props);
        this.validatedTree = props.getMemoizedTree(props.config, props.tree);
        this.oldValidatedTree = this.validatedTree;
    }

    _updateActions(props: IQuery) {
        const {config, dispatch} = props;
        this.actions = bindActionCreators(
            {...actions.tree, ...actions.group, ...actions.rule},
            config,
            dispatch,
        );
    }

    componentDidUpdate(prevProps: IQuery) {
        const {onChange, config, tree, getMemoizedTree} = this.props;

        this.oldValidatedTree = this.validatedTree;
        this.validatedTree = getMemoizedTree(config, tree, prevProps.config);

        if (config !== prevProps.config) {
            this._updateActions(this.props);
            this.forceUpdate();
            this.validatedTree = getMemoizedTree(config, tree, prevProps.config);
        }

        const validatedTreeChanged = !immutableEqual(this.validatedTree, this.oldValidatedTree);

        if (validatedTreeChanged || this.props.sourceLoaded !== prevProps.sourceLoaded) {
            onChange(this.validatedTree, config);
        }
    }

    shouldComponentUpdate = liteShouldComponentUpdate(this, {
        tree: (nextValue: ImmutableTree) => {
            if (
                nextValue === this.oldValidatedTree &&
                this.oldValidatedTree === this.validatedTree
            ) {
                return false;
            }
            return true;
        },
    });

    render() {
        const {config, children, renderBuilder, dispatch, __isInternalValueChange} = this.props;

        const builderProps = {
            tree: this.props.tree,
            actions: this.actions,
            config: config,
            dispatch: dispatch,
            __isInternalValueChange,
        } as unknown as ISortableContainer;

        if (renderBuilder) {
            return renderBuilder(builderProps);
        }

        if (children) {
            return <Builder {...builderProps} children={children} />;
        }

        return null;
    }
}

const ConnectedQuery = connect<IContext, IQuery, IContextState>(
    (state) => {
        return {
            tree: state.tree,
            __isInternalValueChange: state.__isInternalValueChange,
            __lastAction: state.__lastAction,
            dispatch: state.dispatch,
        };
    },
    null,
    Context,
)(Query);

ConnectedQuery.displayName = 'ConnectedQuery';

export default ConnectedQuery;
