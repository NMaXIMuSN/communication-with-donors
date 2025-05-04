'use client';

import React, {useCallback, useEffect, useRef} from 'react';
import {CircleQuestion} from '@gravity-ui/icons';
import cn from 'classnames';
import {Button, Icon, Popup, PopupProps, Text} from '@gravity-ui/uikit';

import {useBooleanState} from '@/shared/lib';

import styles from './FaqButton.module.scss';

type Props = {
    tooltipText: string | React.ReactNode;
    popupProps?: PopupProps;
    classes?: {
        icon?: string;
        btn?: string;
        popup?: string;
    };
};

const FaqButton = (props: Props) => {
    const {tooltipText, popupProps, classes} = props;

    const [open, setOpen, setClose] = useBooleanState(false);

    const bittonRef = useRef<HTMLButtonElement | null>(null);

    const isMouseInPopup = useRef<boolean>(false);
    const isMouseInFaq = useRef<boolean>(false);

    const hoverHandler = useCallback(() => {
        setOpen();
        isMouseInFaq.current = true;
    }, [setOpen]);

    const mouseLeaveHandler = useCallback(() => {
        if (!isMouseInPopup.current) {
            setClose();
        }
        isMouseInFaq.current = false;
    }, [setClose]);

    useEffect(() => {
        if (bittonRef.current) {
            bittonRef.current.addEventListener('mouseover', hoverHandler);
            bittonRef.current.addEventListener('mouseleave', mouseLeaveHandler);
        }
    }, [hoverHandler, mouseLeaveHandler]);

    useEffect(
        () => () => {
            bittonRef.current?.removeEventListener('mouseover', hoverHandler);
            bittonRef.current?.removeEventListener('mouseleave', mouseLeaveHandler);
        },
        [hoverHandler, mouseLeaveHandler],
    );

    return (
        <>
            <Button
                ref={bittonRef}
                view="flat"
                pin="round-round"
                size="s"
                className={cn(styles.button, classes?.btn)}
            >
                <Icon data={CircleQuestion} size={16} className={cn(styles.icon, classes?.icon)} />
            </Button>
            <Popup
                anchorRef={bittonRef}
                open={open}
                className={cn(styles.popup, classes?.popup)}
                placement={popupProps?.placement || 'bottom'}
                onEscapeKeyDown={setClose}
                onOutsideClick={setClose}
                onClose={setClose}
                style={{
                    bottom: 'unset',
                    left: 'unset',
                    top: 0,
                    right: 0,
                    zIndex: 1000,
                }}
                {...popupProps}
            >
                <Text variant="body-1" className={styles.tooltipText}>
                    {tooltipText}
                </Text>
            </Popup>
        </>
    );
};

export default React.memo(FaqButton);
