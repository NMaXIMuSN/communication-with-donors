'use client';
import {useCallback, useEffect, useState} from 'react';

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

export function useDebounceState<T>(initialValue: T, delay = 250): [T, T, (value: T) => void] {
    const [value, setValue] = useState<T>(initialValue);
    const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return [value, debouncedValue, setValue];
}
