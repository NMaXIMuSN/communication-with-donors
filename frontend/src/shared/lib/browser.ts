'use client';

import {useEffect} from 'react';

export const isSSR = () => typeof window === 'undefined';

type ResizeCallback = (rect: DOMRectReadOnly) => void;

export function useResizeObserver(ref: React.RefObject<HTMLElement>, callback: ResizeCallback) {
    useEffect(() => {
        let observedRefValue: HTMLElement | null = null;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // Вызываем коллбэк с новыми размерами
                callback(entry.contentRect);
            }
        });

        if (ref.current) {
            observedRefValue = ref.current;
            observer.observe(observedRefValue);
        }

        return () => {
            if (observedRefValue) {
                observer.unobserve(observedRefValue);
            }
        };
    }, [ref, callback]);
}
