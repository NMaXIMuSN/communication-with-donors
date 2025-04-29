import React, {useEffect, useRef} from 'react';

import {isFunction} from '@/shared/lib';

import styles from './StickyScrollbar.module.scss';

interface IProps {
    width: number;
    scrollWidth: number;
    scrollbarWidth?: number;
    scrollBarRef?: React.ForwardedRef<HTMLDivElement | null>;
    onScrollChanged?: (scrollLeft: number) => void;
}

const StickyScrollbar: React.FC<IProps> = ({
    width,
    scrollWidth,
    scrollbarWidth,
    scrollBarRef,
    onScrollChanged,
}) => {
    const horizontalScrollBarRef = useRef<HTMLDivElement | null>(null);

    const setRef = (element: HTMLDivElement | null) => {
        horizontalScrollBarRef.current = element;

        if (scrollBarRef) {
            // Проверка isFunction для соответствия типов
            if (isFunction(scrollBarRef)) {
                scrollBarRef(element);
            } else {
                scrollBarRef.current = element;
            }
        }
    };

    useEffect(() => {
        // Масштабируем длину прокрутки, так как ширина контенера скрола отличается от длины скрола таблицы и её нужно уменьшить пропорционально
        const scaleScrollLeft = (scrollLeft: number): number => {
            if (scrollbarWidth === undefined || scrollbarWidth === width) {
                return scrollLeft;
            }

            return (scrollLeft * (scrollWidth - width)) / (scrollWidth - scrollbarWidth);
        };

        const handleHorizontalScrollBarScroll = () => {
            if (!horizontalScrollBarRef.current) return;

            const scrollLeft = horizontalScrollBarRef.current.scrollLeft;
            const scaledScrollLeft = scaleScrollLeft(scrollLeft);

            if (onScrollChanged) {
                onScrollChanged(scaledScrollLeft);
            }
        };

        horizontalScrollBarRef.current?.addEventListener('scroll', handleHorizontalScrollBarScroll);

        return () => {
            horizontalScrollBarRef.current?.removeEventListener(
                'scroll',
                handleHorizontalScrollBarScroll,
            );
        };
    }, [width, scrollWidth, scrollbarWidth, onScrollChanged]);

    return (
        <div
            ref={setRef}
            className={styles.container}
            style={{bottom: 0, width: scrollbarWidth ?? width}}
        >
            <div className={styles.thumb} style={{width: scrollWidth}} />
        </div>
    );
};

export default StickyScrollbar;
