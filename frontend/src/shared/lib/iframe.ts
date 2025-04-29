export const isIFrameElement = (iframeElement: unknown): iframeElement is HTMLIFrameElement =>
    iframeElement instanceof HTMLIFrameElement;

export const setHTML = (iframeElement: HTMLIFrameElement, content: string) => {
    const iframeDocument = iframeElement.contentWindow;

    if (!iframeDocument) return;

    iframeDocument.document.open();
    iframeDocument.document.write(content);
    iframeDocument.document.close();
};
