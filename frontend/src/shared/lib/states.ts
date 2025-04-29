'use client';
import {useCallback, useState} from 'react';

declare type SetTrue = () => void;
declare type SetFalse = () => void;
declare type Toggle = () => void;

export function useBooleanState(
    initial: boolean | (() => boolean),
): [boolean, SetTrue, SetFalse, Toggle] {
    const [state, setState] = useState<boolean>(initial);

    const setTrue = useCallback(() => {
        setState(true);
    }, []);

    const setFalse = useCallback(() => {
        setState(false);
    }, []);

    const toggle = useCallback(() => {
        setState((p) => !p);
    }, []);

    return [state, setTrue, setFalse, toggle];
}
