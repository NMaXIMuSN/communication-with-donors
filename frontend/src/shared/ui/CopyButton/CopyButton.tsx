'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button, ButtonProps, Icon} from '@gravity-ui/uikit';
import {Copy, CopyCheck} from '@gravity-ui/icons';

interface IProps {
    label?: string | React.ReactNode;
    value: string;
    isCopyIconAfter?: boolean;
    onCopied?: () => void;
}

const COPIED_STATE_DURATION_IN_MS = 1500;

const CopyButton = (props: IProps & ButtonProps) => {
    const {label, value, isCopyIconAfter = false, view = 'flat', onCopied, ...buttonProps} = props;

    const [isCopied, setIsCopied] = useState<boolean>(false);

    const copiedTimerRef = useRef<number>(0);

    const onClickHandler = useCallback(
        (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
            event.stopPropagation();
            // copyToClipboard(value);
            setIsCopied(true);
            onCopied?.();

            copiedTimerRef.current = window.setTimeout(() => {
                setIsCopied(false);
            }, COPIED_STATE_DURATION_IN_MS);
        },
        [value, onCopied],
    );

    useEffect(
        () => () => {
            clearTimeout(copiedTimerRef.current);
        },
        [],
    );

    return (
        <Button view={view} {...buttonProps} onClick={onClickHandler}>
            {isCopyIconAfter && <Icon data={isCopied ? CopyCheck : Copy} size={16} />}
            {label}
            {!isCopyIconAfter && <Icon data={isCopied ? CopyCheck : Copy} size={16} />}
        </Button>
    );
};

export default React.memo(CopyButton);
