'use client';

import React, {
    CSSProperties,
    HTMLAttributeAnchorTarget,
    useCallback,
    useEffect,
    useId,
    useRef,
} from 'react';
import cn from 'classnames';
import {Popup, PopupOffset, Text, TextProps} from '@gravity-ui/uikit';
import {isString} from 'lodash';
import Link from 'next/link';

import {useBooleanState} from '@/shared/lib';

import styles from './OverflowTooltipText.module.scss';

export type TOverflowTooltipTextProps = {
    width?: number;
    text: string | React.ReactNode;
    maxLines?: 1 | 2 | 3 | 4;
    classNameText?: string;
    zIndex?: number;
    link?: string;
    stylePopup?: CSSProperties;
    target?: HTMLAttributeAnchorTarget;
    offset?: PopupOffset;
};

const POPUP_DEFAULT_POSITION = {
    x: -1,
    y: -1,
};

const OverflowTooltipText = (props: TOverflowTooltipTextProps & TextProps) => {
    const {
        width,
        className,
        maxLines = 2,
        zIndex = 10,
        classNameText,
        style,
        text,
        link,
        stylePopup,
        wordBreak = 'break-word',
        target,
        offset,
        ...restTextProps
    } = props;

    const [open, setOpen, setClose] = useBooleanState(false);

    const textRef = useRef<HTMLSpanElement | null>(null);
    const initialPosition = useRef({...POPUP_DEFAULT_POSITION});

    const popupId = useId();
    const textId = useId();

    const closePopUpHandler = useCallback(() => {
        initialPosition.current = {...POPUP_DEFAULT_POSITION};
        setClose();
    }, [setClose]);

    const hoverHandler = useCallback(() => {
        setOpen();
    }, [setOpen]);

    const mouseLeaveHandler: React.MouseEventHandler<HTMLDivElement> = useCallback(
        (event) => {
            // Достаём из события элемент куда переместился курсор и если это не попап или его кконтент
            // то закрывает тултип
            if (
                // @ts-expect-error
                event.relatedTarget.id !== popupId &&
                // @ts-expect-error
                event.relatedTarget?.parentNode?.id !== popupId
            ) {
                closePopUpHandler();
            }
        },
        [closePopUpHandler, popupId],
    );

    useEffect(() => {
        if (textRef.current) {
            const width = textRef.current.offsetHeight;
            const scrollWidth = textRef.current.scrollHeight || 0;

            // Навешиваем ховер лисенер для открытия попапа, только если текст не помещается
            if (width < scrollWidth) {
                textRef.current.addEventListener('mouseover', hoverHandler);
            } else {
                textRef.current.removeEventListener('mouseover', hoverHandler);
            }
        }
    }, [hoverHandler, text]);

    useEffect(
        () => () => {
            textRef.current?.removeEventListener('mouseover', hoverHandler);
        },
        [hoverHandler, text],
    );

    return (
        <>
            <Text
                ref={textRef}
                className={cn(
                    styles.ellipsis,
                    className,
                    classNameText,
                    styles[`ellipsis${maxLines}line`],
                    {
                        [styles.link]: link,
                    },
                )}
                style={
                    width
                        ? {
                              ...style,
                              width: `${width}px`,
                          }
                        : style
                }
                onMouseLeave={mouseLeaveHandler}
                id={textId}
                wordBreak={wordBreak}
                {...restTextProps}
            >
                {link ? (
                    <Link href={link} target={target} className={styles.disableLinkStyle}>
                        {text}
                    </Link>
                ) : (
                    text
                )}
            </Text>
            <Popup
                anchorRef={textRef}
                open={open}
                onEscapeKeyDown={closePopUpHandler}
                onOutsideClick={closePopUpHandler}
                onClose={closePopUpHandler}
                id={popupId}
                offset={offset}
                // устанавливаем модификатор для реактпопера
                style={{
                    bottom: 'unset',
                    left: 'unset',
                    top: -5,
                    right: 0,
                    zIndex: zIndex,
                    ...stylePopup,
                }}
            >
                {isString(text) ? (
                    <Text className={cn(className)} style={style}>
                        {text}
                    </Text>
                ) : (
                    text
                )}
            </Popup>
        </>
    );
};

export default React.memo(OverflowTooltipText);
