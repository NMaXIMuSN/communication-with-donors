'use client';
import {useEffect} from 'react';

interface IOptions {
    // Элемент, на который подписывается callback
    element: HTMLElement | null;
    // callback дергается, когда появляется элемент во viewport
    callback: () => void;
}

export const useInfiniteScroll = (options: IOptions) => {
    const {element, callback} = options;

    useEffect(() => {
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.length && entries[0].intersectionRatio >= 0.01) {
                    callback();
                }
            },
            {threshold: 0.01},
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [element, callback]);
};
