import React, {useCallback, useEffect, useRef, useState} from 'react';

import {useResizeObserver} from '@/shared/lib/browser';

export const TABLE_HEADER_ID = 'table-header';
export const TABLE_BODY_ID = 'table-body';

export const useStickyScrollbar = (containerRef: React.RefObject<HTMLDivElement>) => {
    // Нужен именно стейт, что бы перерисовывать горизонтальный скрол при изменении ширины, таблицы
    const [tableScrollWidth, setTableScrollWidth] = useState<number>(0);
    const [containerWidth, setContainerWidth] = useState<number>(0);

    const tableHeaderRef = useRef<HTMLElement | null>(null);
    const tableBodyRef = useRef<HTMLElement | null>(null);
    const horizontalScrollBar = useRef<HTMLDivElement | null>(null);

    const onHorizontalScrollChanged = useCallback((scrollLeft: number) => {
        if (!tableBodyRef.current || !tableHeaderRef.current) {
            return;
        }

        tableBodyRef.current.scrollLeft = scrollLeft;
        tableHeaderRef.current.scrollLeft = scrollLeft;
    }, []);

    // ВоркЭраунд - проблема в том, что правило stiky(нужно, что бы при скроле вниз, заголовки табицы прилипали к верху экрана) не применяется если у родителей есть хоть какое-то правило overflow
    // решение - убрать оверфлоу у контейнера и добавить его заголовку и телу таблицы
    // что бы они скролисть одновременно, дизейблим скрол заголовка полностью и приравниваем его скролу тела таблицы
    useEffect(() => {
        // т.к. нельзя прокинуть реф напрямую через пропсы
        const theader = document.getElementById(TABLE_HEADER_ID);
        const tbody = document.getElementById(TABLE_BODY_ID);

        if (!theader || !tbody) return;

        tableBodyRef.current = tbody;
        tableHeaderRef.current = theader;

        const syncScroll = (e: Event) => {
            // @ts-expect-error
            theader.scrollLeft = e.target?.scrollLeft;
            if (horizontalScrollBar.current?.scrollLeft) {
                // @ts-expect-error
                horizontalScrollBar.current.scrollLeft = e.target?.scrollLeft;
            }
        };
        tbody.addEventListener('scroll', syncScroll);
        return () => {
            tbody.removeEventListener('scroll', syncScroll);
        };
    }, []);

    // Отлавливаем изменение ширины контейнера, что бы обновить ширину компонента-скрола
    useResizeObserver(containerRef, (rect) => {
        setContainerWidth(rect.width);
    });

    // Отлавливае изменение ширины скрола таблицы, что бы обновить ширину прокрутки компонента-скрола
    useResizeObserver(tableBodyRef, () => {
        if (tableBodyRef.current) {
            // Так как ResizeObserver не позволяет получить ширину скрола, достаем её из реф
            setTableScrollWidth(tableBodyRef.current?.scrollWidth);
        }
    });

    return {
        tableScrollWidth,
        containerWidth,
        onHorizontalScrollChanged,
        horizontalScrollBar,
    };
};
