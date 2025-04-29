import React, {createRef} from 'react';
import Immutable from 'immutable';
import {
    ImmutableTree,
    ItemProperties,
    JsonTree,
    Placement,
    RuleProperties,
    Utils,
} from '@react-awesome-query-builder/core';
import {isEqual} from 'lodash';

import {IBuilder} from '../Builder/Builder';
import {IBuilderProps, IDrag, IQbUtils, IdPath, ItemType, TJsonItem} from '../../types';
import {
    actions,
    addLabels,
    connect,
    isUsingLegacyReactDomRender,
    libOnPropsChanged,
    pureShouldComponentUpdate,
    toImmutableList,
} from '../../lib';
import {Context, IContext, IContextState} from '../../context';
import {TQueryBuilderChildrenFn} from '../../QueryBuilder';

const QbUtils = Utils as IQbUtils;

const {clone, uuid} = QbUtils;
const {defaultRuleProperties} = QbUtils.DefaultUtils;
const {getFlatTree, expandTreeSubpath, expandTreePath} = QbUtils.TreeUtils;

let _isReorderingTree = false;

export interface ISortableContainer extends IBuilderProps {
    children: TQueryBuilderChildrenFn;
    dragging: IDrag;
    dragStart: IDrag;
    mousePos: Event;
    setDragStart: Function;
    setDragProgress: Function;
    setDragEnd: Function;
    dontCreateNewItemOnMove?: boolean;
}

interface ICustomMouseEvent extends MouseEvent {
    __mocked_window?: Window;
    __mock_dom?: Function;
    __mocked_hov_container?: Element;
}

const createSortableContainer = <T extends ISortableContainer>(
    Builder: React.ComponentType<IBuilder>,
): React.ComponentType<T> =>
    class SortableContainer extends React.Component<T> {
        tree: {
            items: {
                [key: string]: IDrag['itemInfo'];
            };
        };
        pureShouldComponentUpdate: Function;
        _isUsingLegacyReactDomRender: unknown;
        _cacheEls: {[key: string]: Element | null};
        eventTarget: HTMLElement | Window | null;
        state: {
            placement?: string;
            hovNode?: IDrag['itemInfo'];
            hovElement?: Element;
        };
        scrollInterval?: NodeJS.Timer;
        prevDraggingY: number;

        // used as ref for draggable container of query-builder
        attrRef = createRef<HTMLDivElement>();

        constructor(props: T) {
            super(props);

            this.tree = getFlatTree(props.tree);
            this.pureShouldComponentUpdate = pureShouldComponentUpdate(this);
            this.setGroupLabel = this.setGroupLabel.bind(this);
            this.onItemClick = this.onItemClick.bind(this);
            libOnPropsChanged(this);

            this.onPropsChanged(props);

            this.state = {
                placement: undefined,
                hovNode: undefined,
                hovElement: undefined,
            };

            this._cacheEls = {};
            this.eventTarget = null;
            this.prevDraggingY = 0;
        }

        onPropsChanged(nextProps: ISortableContainer) {
            this.tree = getFlatTree(nextProps.tree);
        }

        shouldComponentUpdate(nextProps: ISortableContainer, nextState: unknown) {
            const prevProps = this.props as ISortableContainer;
            const prevState = this.state;

            let should = this.pureShouldComponentUpdate(nextProps, nextState);
            if (should) {
                if (prevState === nextState && prevProps !== nextProps) {
                    const chs: string[] = [];
                    for (const k in nextProps) {
                        if (nextProps.hasOwnProperty(k)) {
                            const changed =
                                nextProps[k as keyof ISortableContainer] !==
                                prevProps[k as keyof ISortableContainer];
                            if (changed) {
                                //don't render <Builder> on dragging - appropriate redux-connected components will do it
                                if (k !== 'dragging' && k !== 'mousePos') chs.push(k);
                            }
                        }
                    }

                    if (!chs.length) should = false;
                }
            }

            return should;
        }

        componentDidUpdate() {
            const dragging = this.props.dragging;
            const startDragging = this.props.dragStart;
            _isReorderingTree = false;
            if (startDragging && startDragging.id) {
                dragging.itemInfo = this.tree.items[dragging.id];
                if (dragging.itemInfo) {
                    if (
                        dragging.itemInfo.index != startDragging.itemInfo.index ||
                        dragging.itemInfo.parent != startDragging.itemInfo.parent
                    ) {
                        const treeEl = startDragging.treeEl;
                        const treeElContainer = startDragging.treeElContainer;
                        const plhEl = this._getPlaceholderNodeEl(treeEl, true) as HTMLElement;
                        if (plhEl) {
                            const plX = plhEl.getBoundingClientRect().left + window.scrollX;
                            const plY = plhEl.getBoundingClientRect().top + window.scrollY;
                            const oldPlX = startDragging.plX;
                            const oldPlY = startDragging.plY;
                            const scrollTop = treeElContainer.scrollTop;
                            startDragging.plX = plX;
                            startDragging.plY = plY;
                            startDragging.itemInfo = clone(dragging.itemInfo);
                            startDragging.y = plhEl.offsetTop;
                            startDragging.x = plhEl.offsetLeft;
                            startDragging.clientY += plY - oldPlY;
                            startDragging.clientX += plX - oldPlX;
                            if (treeElContainer != document.body)
                                startDragging.scrollTop = scrollTop;

                            this.onDrag(this.props.mousePos, false);
                        }
                    }
                }
            }
        }

        _getNodeElById(treeEl: HTMLElement, indexId: string, ignoreCache = false) {
            if (indexId == null) return null;
            if (!this._cacheEls) this._cacheEls = {};
            let el = this._cacheEls[indexId];
            if (el && document.contains(el) && !ignoreCache) return el;
            el = treeEl.querySelector('.group-or-rule-container[data-id="' + indexId + '"]');
            this._cacheEls[indexId] = el;
            return el;
        }

        _getDraggableNodeEl(treeEl: HTMLElement, ignoreCache = false) {
            if (!this._cacheEls) this._cacheEls = {};
            let el = this._cacheEls['draggable'];
            if (el && document.contains(el) && !ignoreCache) return el;
            const els = treeEl.getElementsByClassName('qb-draggable');
            el = els.length ? els[0] : null;
            this._cacheEls['draggable'] = el;
            return el;
        }

        _getPlaceholderNodeEl(treeEl: HTMLElement, ignoreCache = false) {
            if (!this._cacheEls) this._cacheEls = {};
            let el = this._cacheEls['placeholder'];
            if (el && document.contains(el) && !ignoreCache) return el;
            const els = treeEl.getElementsByClassName('qb-placeholder');
            el = els.length ? els[0] : null;
            this._cacheEls['placeholder'] = el;
            return el;
        }

        _isScrollable(node: HTMLElement) {
            const computedStyles = window.getComputedStyle(node);
            const overflowY = computedStyles.getPropertyValue('overflow-y');
            return (
                (overflowY === 'scroll' || overflowY === 'auto') &&
                node.scrollHeight > node.offsetHeight
            );
        }

        _getScrollParent(node: HTMLElement): HTMLElement | null {
            if (node === null) return null;

            if (node === document.body || this._isScrollable(node)) {
                return node;
            } else {
                return this._getScrollParent(node.parentNode as HTMLElement);
            }
        }

        _getEventTarget = (e?: ICustomMouseEvent) => {
            return (e && e?.__mocked_window) || document.body || window;
        };

        disableScroll = () => {
            clearInterval(this.scrollInterval as unknown as number);
            this.scrollInterval = undefined;
        };

        onDragStart = (id: string, dom: HTMLElement, e: MouseEvent) => {
            const treeEl = dom.closest('.query-builder');

            if (!treeEl) return;
            if (this._isUsingLegacyReactDomRender === undefined) {
                this._isUsingLegacyReactDomRender = isUsingLegacyReactDomRender(treeEl);
            }
            document.body.classList.add('qb-dragging');
            treeEl.classList.add('qb-dragging');

            let treeElContainer = (treeEl.closest('.query-builder-container') ||
                treeEl) as HTMLElement;
            treeElContainer = this._getScrollParent(treeElContainer) || document.body;
            const scrollTop = treeElContainer.scrollTop;

            const tmpAllGroups = treeEl.querySelectorAll('.group--children');
            const anyGroup = tmpAllGroups.length ? tmpAllGroups[0] : null;
            let groupPadding;
            if (anyGroup) {
                groupPadding = window
                    .getComputedStyle(anyGroup, null)
                    .getPropertyValue('padding-left');
                groupPadding = parseInt(groupPadding);
            }

            const domClientRect = dom.getBoundingClientRect();

            const dragging = {
                id: id,
                name: id,
                x: domClientRect.left,
                y: domClientRect.top,
                w: dom.offsetWidth,
                h: dom.offsetHeight,
                itemInfo: this.tree.items[id],
                paddingLeft: groupPadding,
            };

            this.prevDraggingY = dragging.y;

            const paddingX = e.clientX - domClientRect.left;
            const paddingY = e.clientY - domClientRect.top;

            const dragStart = {
                id: id,
                x: dom.offsetLeft,
                y: dom.offsetTop,
                scrollTop: scrollTop,
                clientX: e.clientX,
                clientY: e.clientY,
                itemInfo: clone(this.tree.items[id]),
                treeEl: treeEl,
                treeElContainer: treeElContainer,
                paddingX,
                paddingY,
            };

            const mousePos = {
                clientX: e.clientX,
                clientY: e.clientY,
            };

            const target = this._getEventTarget(e);
            this.eventTarget = target;
            target.addEventListener('mousemove', this.onDrag);
            target.addEventListener('mouseup', this.onDragEnd);

            // сброс выделения текста
            if (window && window.getSelection) {
                window.getSelection()?.removeAllRanges();
            }

            this.props.setDragStart(dragStart, dragging, mousePos);
        };

        onDrag = (event: Event, doHandleDrag = true) => {
            const e = event as ICustomMouseEvent;

            const dragging = Object.assign({}, this.props.dragging);
            const startDragging = this.props.dragStart;
            const paddingLeft = dragging.paddingLeft;
            const treeElContainer = startDragging.treeElContainer;
            const scrollTop = treeElContainer.scrollTop;
            dragging.itemInfo = this.tree.items[dragging.id];

            if (!dragging.itemInfo && !dragging.name && scrollTop) {
                return;
            }

            // Скролл страницы, когда элемент двигают к верхнему или нижнему краю
            const documentClientHeight = document.documentElement.clientHeight;
            const elementY = e.y;
            const scrollArea = 70;
            const scrollStep = 10;
            let scrollDirection = 0;

            const isElementMoved =
                this.prevDraggingY &&
                (this.prevDraggingY > dragging.y + scrollArea ||
                    this.prevDraggingY < dragging.y - scrollArea);

            const handleScroll = () => {
                window.scrollTo(0, window.scrollY + scrollDirection * scrollStep);
            };

            if (isElementMoved) {
                if (elementY > documentClientHeight - scrollArea && !this.scrollInterval) {
                    scrollDirection = 1;
                    this.scrollInterval = setInterval(handleScroll, 25);
                } else if (elementY < scrollArea && !this.scrollInterval) {
                    scrollDirection = -1;
                    this.scrollInterval = setInterval(handleScroll, 25);
                }
            }

            if (
                this.scrollInterval &&
                elementY >= scrollArea &&
                elementY <= documentClientHeight - scrollArea
            ) {
                this.disableScroll();
            }

            const mousePos = {
                clientX: (e as MouseEvent).clientX,
                clientY: (e as MouseEvent).clientY,
            };

            const startMousePos = {
                clientX: startDragging.clientX,
                clientY: startDragging.clientY,
            };

            if (e.__mock_dom) {
                const treeEl = startDragging.treeEl;
                const dragEl = this._getDraggableNodeEl(treeEl);
                const plhEl = this._getPlaceholderNodeEl(treeEl);
                e.__mock_dom({treeEl, dragEl, plhEl});
            }

            // first init plX/plY
            if (!startDragging.plX) {
                const treeEl = startDragging.treeEl;
                const plhEl = this._getPlaceholderNodeEl(treeEl);

                if (plhEl) {
                    startDragging.plX = plhEl.getBoundingClientRect().left + window.scrollX;
                    startDragging.plY = plhEl.getBoundingClientRect().top + window.scrollY;
                }
            }

            dragging.x = mousePos.clientX - startDragging?.paddingX;
            dragging.y = mousePos.clientY - startDragging?.paddingY;
            dragging.paddingLeft = paddingLeft;
            dragging.mousePos = mousePos;
            dragging.startMousePos = startMousePos;

            this.props.setDragProgress(mousePos, dragging);

            const moved = doHandleDrag ? this.handleDrag(dragging, e) : false;

            if (!moved && e.preventDefault) {
                e.preventDefault();
            }
        };

        onDragEnd = () => {
            this.disableScroll();
            this.prevDraggingY = 0;

            const treeEl = this.props.dragStart.treeEl;

            this.props.setDragEnd();

            treeEl.classList.remove('qb-dragging');
            document.body.classList.remove('qb-dragging');
            this._cacheEls = {};

            const target = this.eventTarget || this._getEventTarget();
            target.removeEventListener('mousemove', this.onDrag);
            target.removeEventListener('mouseup', this.onDragEnd);

            if (this.state.hovNode) {
                // перетаскивание правила
                if (this.props.dragging.itemInfo) {
                    if (
                        !isEqual(this.props.dragging.itemInfo.path, this.state.hovNode.path) &&
                        !this.state.hovNode.path.includes(this.props.dragging.id)
                    ) {
                        if (!this.props.dontCreateNewItemOnMove) {
                            this.removeSelfHandler(this.props.dragging.itemInfo.path);
                        }

                        this.props.actions.moveItem(
                            this.props.dragging.itemInfo.path,
                            this.state.hovNode.path,
                            this.state.placement as Placement,
                        );
                    }
                    // добавление нового правила из списка
                } else {
                    this.addNewItem(this.state.hovNode.path, this.state.placement || 'after', {
                        field: this.props.dragging.name,
                    });
                }

                const idNewParent = this.state.hovNode.path.at(-2);
                // удаление пустого правила если оно есть
                if (idNewParent && this.tree.items[idNewParent].children) {
                    const emptyRuleId = this.tree.items[idNewParent].children!.find((el) => {
                        return (
                            this.tree.items[el].type === 'rule' &&
                            !this.tree.items[el].node.toJS()?.properties?.field
                        );
                    });

                    if (emptyRuleId) {
                        this.props.actions.removeRule(this.tree.items[emptyRuleId].path);
                    }
                }
            }

            this.resetDragState();
        };

        handleDrag(dragInfo: ISortableContainer['dragging'], e: ICustomMouseEvent) {
            const treeEl = this.props.dragStart.treeEl;
            const dragEl = this._getDraggableNodeEl(treeEl);
            let dragRect;

            if (dragInfo.name && dragEl) {
                dragRect = dragEl.getBoundingClientRect();
                const trgCoord = {
                    x: dragRect.left + (dragRect.right - dragRect.left) / 2,
                    y: dragRect.top + (dragRect.bottom - dragRect.top) / 2,
                };
                let hovCNodeEl;
                if (e.__mocked_hov_container) {
                    hovCNodeEl = e.__mocked_hov_container;
                } else {
                    const hovNodeEl = document.elementFromPoint(trgCoord.x, trgCoord.y - 1);
                    if (!hovNodeEl) return;
                    hovCNodeEl = hovNodeEl.closest('.group-or-rule-container');
                    const hovNodeId = hovCNodeEl?.getAttribute('data-id') || '';
                    const hovII = this.tree.items[hovNodeId];

                    if (!hovCNodeEl || !hovNodeId || !hovII) {
                        this.resetDragState();
                        return;
                    }
                    const isEmpty = !(
                        hovII.node.toJS()?.properties?.field || hovII.node.toJS()?.type === 'group'
                    );

                    const isMainGroup = hovII.path.length === 1;
                    const isSameDraggingElement = (hovII.path || []).includes(
                        this.props.dragging.id,
                    );

                    if (isMainGroup || isSameDraggingElement) return;

                    const hovNodeRect = hovCNodeEl.getBoundingClientRect();

                    const before =
                        trgCoord.y > hovNodeRect.top &&
                        trgCoord.y < hovNodeRect.top + (hovNodeRect.bottom - hovNodeRect.top) / 2;

                    if (!isEmpty) {
                        if (before) {
                            hovCNodeEl.classList.add('group-or-rule-placeholder__top');
                            hovCNodeEl.classList.remove('group-or-rule-placeholder__bottom');
                        } else {
                            hovCNodeEl.classList.add('group-or-rule-placeholder__bottom');
                            hovCNodeEl.classList.remove('group-or-rule-placeholder__top');
                        }
                    }

                    if (this.state.hovElement && this.state.hovElement !== hovCNodeEl) {
                        this.state.hovElement.classList.remove('group-or-rule-placeholder__bottom');
                        this.state.hovElement.classList.remove('group-or-rule-placeholder__top');
                    }

                    this.setState({
                        placement: before ? 'before' : 'after',
                        hovNode: hovII,
                        hovElement: hovCNodeEl,
                    });
                }
            }
        }

        resetDragState() {
            if (!this.state.hovElement) {
                return;
            }
            this.state.hovElement.classList.remove('group-or-rule-placeholder__bottom');
            this.state.hovElement.classList.remove('group-or-rule-placeholder__top');

            this.setState({
                placement: undefined,
                hovNode: undefined,
                hovElement: undefined,
            });
        }

        onItemClick(field: string) {
            const key = uuid();

            const type = this.props.config.fields[field].type;
            console.log(type, this.props.config.types[type]);
            const defaultOperator = this.props.config.types[type].defaultOperator;

            const properties = Immutable.OrderedMap(
                defaultRuleProperties(this.props.config).merge({
                    field,
                    operator: defaultOperator,
                    valueType: [type],
                }),
            );

            const path = this.props.tree.get('path').concat(key);

            const value = Immutable.OrderedMap({
                id: key,
                type: ItemType.rule,
                properties,
                path,
            });

            const newTree = this.props.tree.updateIn(['children1'], (children) => {
                const entries = children.entrySeq().toArray();
                entries.push([key, value]);
                return Immutable.OrderedMap(entries);
            });
            const validatedTree = this.validateTree(newTree);
            this.props.actions.setTree(validatedTree);
        }

        validateTree(tree?: ImmutableTree) {
            const state = tree || this.props.tree;
            const path = this.props.dragStart.itemInfo?.path || [];

            const toPath = toImmutableList(
                expandTreeSubpath(
                    toImmutableList(['children1'].concat(path.slice(1, -1))),
                    'children1',
                )
                    .slice(1)
                    .toArray(),
            );

            const newTree = state.updateIn(toPath, (children: ImmutableTree) => {
                const entries = children.entrySeq().toArray();

                const validEntries = entries.filter((el) => {
                    const valueJS = el[1].toJS() as TJsonItem;

                    if (valueJS.type === ItemType.rule && !valueJS.properties.field) {
                        return false;
                    }

                    return true;
                });
                return Immutable.OrderedMap(validEntries);
            });

            return newTree;
        }

        copyRule = (path: IdPath) => {
            const state = this.props.tree;
            const copyPath = Array.isArray(path) ? path : path.toArray();
            const copyRuleId = copyPath[copyPath.length - 1];

            const toPath = toImmutableList(
                expandTreeSubpath(
                    toImmutableList(['children1'].concat(copyPath.slice(1, copyPath.length - 1))),
                    'children1',
                )
                    .slice(1)
                    .toArray(),
            );

            const newTree = state.updateIn(toPath, (children) => {
                const entries = children.entrySeq().toArray();
                const rule = entries.find((el: ImmutableTree[]) => {
                    const valueJS = el[1].toJS() as TJsonItem;
                    return valueJS.id === copyRuleId;
                });
                const newKey = uuid();

                const newProperties = Immutable.OrderedMap(
                    defaultRuleProperties(this.props.config).merge(
                        rule ? rule[1]?.toJS().properties : {},
                    ),
                );
                const newPath = toImmutableList(path.slice(0, copyPath.length - 1).concat(newKey));
                const newValue = Immutable.OrderedMap({
                    id: newKey,
                    type: ItemType.rule,
                    properties: newProperties,
                    path: newPath,
                });
                const index = children.keySeq().indexOf(copyRuleId);
                entries.splice(index, 0, [newKey, newValue]);
                return Immutable.OrderedMap(entries);
            });
            this.props.actions.setTree(newTree);
        };

        addNewItem(path: string[], placement: string, properties?: ItemProperties) {
            const state = this.props.tree;

            const newKey = uuid();

            const field = (properties as RuleProperties)?.field as string | undefined;
            const type = field && this.props.config.fields[field].type;
            const defaultOperator = type && this.props.config.types[type].defaultOperator;

            const newProperties = Immutable.OrderedMap(
                defaultRuleProperties(this.props.config).merge({
                    ...properties,
                    operator: defaultOperator,
                    valueType: [type],
                }),
            );
            const newPath = toImmutableList(path.slice(0, path.length - 1).concat(newKey));
            const newValue = Immutable.OrderedMap({
                id: newKey,
                type: ItemType.rule,
                properties: newProperties,
                path: newPath,
            });

            const hovId = path[path.length - 1];
            const toPath = toImmutableList(
                expandTreeSubpath(
                    toImmutableList(['children1'].concat(path.slice(1, path.length - 1))),
                    'children1',
                )
                    .slice(1)
                    .toArray(),
            );
            function insertOrderedMapValue(
                map: ImmutableTree,
                keyToInsert: string,
                placement: string,
                newKey: string,
                newValue: Immutable.OrderedMap<string, unknown>,
            ) {
                if (keyToInsert !== undefined) {
                    let index = map.keySeq().indexOf(keyToInsert);
                    if (placement === 'after') index += 1;
                    const entries = map.entrySeq().toArray();
                    entries.splice(index, 0, [newKey, newValue]);
                    return Immutable.OrderedMap(entries);
                }

                return map;
            }

            const newTree = state.updateIn(toPath, (children) => {
                const newMap = insertOrderedMapValue(children, hovId, placement, newKey, newValue);
                return newMap;
            });

            this.props.actions.setTree(newTree);
        }

        removeSelfHandler = (path: IdPath) => {
            const size = this.props.tree.getIn(
                expandTreePath(toImmutableList(path.slice(0, -1)), 'children1'),
            )?.size;

            if (size && size < 2) {
                this.addNewItem(toImmutableList(path).toArray(), 'after');
            }
        };

        setGroupLabel(path: string[], label?: string) {
            let newTree;
            let not = false;

            if (!label) {
                newTree = Utils.checkTree(
                    Utils.loadTree(addLabels(this.props.tree.toJS()) as unknown as JsonTree),
                    this.props.config,
                );
            } else {
                const state = Utils.loadTree(this.props.tree as unknown as JsonTree);
                const toPath = toImmutableList(
                    expandTreeSubpath(
                        toImmutableList(['children1'].concat(path.slice(1))),
                        'children1',
                    )
                        .slice(1, -1)
                        .toArray(),
                );

                newTree = state.updateIn(toPath, (group) => {
                    const newGroup = group.set('label', label);
                    not = group.get('properties')?.get('not') || false;
                    return Immutable.OrderedMap(newGroup);
                });
            }

            this.props.actions.setTree(newTree);
            this.props.actions.setNot(toImmutableList(path), not);
        }

        render() {
            return (
                <Builder
                    {...this.props}
                    children={this.props.children}
                    attrRef={this.attrRef}
                    onItemClick={this.onItemClick}
                    onDragStart={this.onDragStart}
                    setGroupLabel={this.setGroupLabel}
                    copyRule={this.copyRule}
                    removeSelfHandler={this.removeSelfHandler}
                />
            );
        }
    };

export default (Builder: React.ComponentType<IBuilder>) => {
    const ConnectedSortableContainer = connect<IContext, ISortableContainer, IContextState>(
        (state: IContextState) => {
            return {
                dragging: state.dragging,
                dragStart: state.dragStart,
                mousePos: state.mousePos,
                tree: state.tree,
            };
        },
        {
            setDragStart: actions.drag.setDragStart,
            setDragProgress: actions.drag.setDragProgress,
            setDragEnd: actions.drag.setDragEnd,
        },
        Context,
    )(createSortableContainer(Builder));

    ConnectedSortableContainer.displayName = 'ConnectedSortableContainer';

    return ConnectedSortableContainer;
};

export {_isReorderingTree};
