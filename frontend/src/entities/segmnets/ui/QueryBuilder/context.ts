import React from 'react';
import {ImmutableTree} from '@react-awesome-query-builder/core';

import {IDrag} from './types';

export interface IContext {
    getState: () => {tree: ImmutableTree; dragging: IDrag; dragStart: IDrag; mousePos: Event};
    dispatch: Function;
    subscribe: Function;
}

export interface IContextState {
    tree: ImmutableTree;
    dragging: IDrag;
    dragStart: IDrag;
    mousePos: Event;
    dispatch: unknown;
    __isInternalValueChange?: unknown;
    __lastAction?: unknown;
}

export const Context = React.createContext<IContext>({} as IContext);
