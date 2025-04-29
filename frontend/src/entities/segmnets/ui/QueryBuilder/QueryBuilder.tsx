import {Component, ReactNode} from 'react';
import {
    Config,
    ImmutableTree,
    TreeStore as treeStoreReducer,
} from '@react-awesome-query-builder/core';
import {isEqual} from 'lodash';

import {
    actions,
    createConfigMemo,
    createStore,
    createValidationMemo,
    liteShouldComponentUpdate,
    toImmutableList,
} from './lib';
import {Context, IContext} from './context';
import {ConnectedQuery} from './ui';
import {IConfig} from './types';
import Item, {IItem} from './ui/Item/Item';
import {IList, List} from './ui/List/List';
import {Layout} from './ui/Layout/Layout';
import {ListColumn} from './ui/ListColumn/ListColumn';
import {ListBox} from './ui/ListBox/ListBox';
import {ListGroup} from './ui/ListGroup/ListGroup';
import {ItemsTreeColumn} from './ui/ItemsTreeColumn/ItemsTreeColumn';
import {ListSearch} from './ui/ListSearch/ListSearch';

export type TQueryBuilderChildrenFn = (props: {
    listProps: IList;
    itemsTreeProps: IItem;
}) => ReactNode;

interface IQueryBuilder {
    children?: TQueryBuilderChildrenFn;
    value: ImmutableTree;
    onChange: Function;
    renderBuilder?: Function;
    config: IConfig;
    sourceLoaded: boolean;
}

interface IQueryBuilderState {
    store: IContext;
}

const treeReducer = treeStoreReducer as (
    config: IConfig,
    validatedTree: ImmutableTree,
    getMemoizedTree: Function,
    setLastTree: Function,
) => Function;

export default class QueryBuilder extends Component<IQueryBuilder, IQueryBuilderState> {
    static List = List;
    static ItemsTree = Item;

    static Layout = Layout;
    static ListColumn = ListColumn;
    static ListBox = ListBox;
    static ListGroup = ListGroup;
    static ItemsTreeColumn = ItemsTreeColumn;
    static ListSearch = ListSearch;

    getMemoizedConfig: Function;
    getMemoizedTree: Function;
    config: Config;
    prevTree?: ImmutableTree;
    prevprevTree?: ImmutableTree;

    constructor(props: IQueryBuilder, context: IContext) {
        super(props, context);

        this.getMemoizedConfig = createConfigMemo();
        this.getMemoizedTree = createValidationMemo();

        const config = this.getMemoizedConfig({...props, ...props.config});
        const tree = props.value;
        const validatedTree = this.getMemoizedTree(config, tree);

        const reducer = treeReducer(
            config,
            validatedTree,
            this.getMemoizedTree,
            this.setLastTree,
        ) as (state?: object, actions?: object) => object;
        const store = createStore(reducer) as unknown as IContext;

        this.config = config;
        this.state = {
            store: store,
        };
    }

    componentDidUpdate(prevProps: IQueryBuilder) {
        const config = this.getMemoizedConfig({...this.props, ...this.props.config});
        const prevConfig = this.getMemoizedConfig({...prevProps, ...prevProps.config});
        const isConfigChanged = !isEqual(config, prevConfig);

        const tree = this.props.value;
        const prevTree = prevProps.value;

        const treeJS = tree.toJS();
        const prevTreeJS = prevTree.toJS();
        const stateTreeJS = this.state.store.getState().tree.toJS();

        const isTreeChanged = !isEqual(treeJS, prevTreeJS) && !isEqual(treeJS, stateTreeJS);

        if (isTreeChanged || isConfigChanged) {
            const validatedTree = this.getMemoizedTree(config, this.props.value);
            this.state.store.dispatch(actions.tree.setTree(config, validatedTree));
        }

        if (isConfigChanged || this.props.sourceLoaded !== prevProps.sourceLoaded) {
            this.updateReducer();
        }

        const currentIsLocked = tree.toJS().properties.isLocked;
        const prevIsLocked = prevTree.toJS().properties.isLocked;

        if (currentIsLocked !== prevIsLocked) {
            this.state.store.dispatch(
                actions.group.setLock(
                    config,
                    toImmutableList([this.props.value.get('id')]),
                    currentIsLocked,
                ),
            );
        }
    }

    updateReducer() {
        const config = this.getMemoizedConfig({...this.props, ...this.props.config});
        const tree = this.props.value;
        const validatedTree = this.getMemoizedTree(config, tree);

        const reducer = treeReducer(
            config,
            validatedTree,
            this.getMemoizedTree,
            this.setLastTree,
        ) as (state?: object, actions?: object) => object;
        const store = createStore(reducer) as unknown as IContext;

        this.config = config;
        this.setState({
            store: store,
        });
    }

    setLastTree = (lastTree: ImmutableTree) => {
        if (this.prevTree) {
            this.prevprevTree = this.prevTree;
        }
        this.prevTree = lastTree;
    };

    shouldComponentUpdate = liteShouldComponentUpdate(this, {
        value: () => {
            return false;
        },
    });

    render() {
        const {children, onChange} = this.props;
        const {store} = this.state;

        const config = this.config;

        return (
            <Context.Provider value={store}>
                <ConnectedQuery
                    config={config as IConfig}
                    sourceLoaded={this.props.sourceLoaded}
                    getMemoizedTree={this.getMemoizedTree}
                    renderBuilder={this.props.renderBuilder}
                    onChange={onChange}
                    children={children}
                />
            </Context.Provider>
        );
    }
}
