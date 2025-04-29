import {isIFrameElement, setHTML} from '@/shared/lib';
import {debounce} from 'lodash';
import {MutableRefObject, useEffect} from 'react';

const emptyHtml = '<p style="color: red">Разметка отсутствует</p>';
const htmlWrapper = (content: string) => `<html>${content}</html>`;

export const useDrawIframe = (
    iframe: MutableRefObject<HTMLIFrameElement | null>,
    content?: string,
) => {
    const drawPreview = debounce(() => {
        if (isIFrameElement(iframe.current)) {
            setHTML(iframe.current, htmlWrapper(content || emptyHtml));
        }
    }, 200);

    useEffect(() => drawPreview(), [content]);
};
