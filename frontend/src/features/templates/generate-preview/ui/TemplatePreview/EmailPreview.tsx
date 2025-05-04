import {FC, useCallback, useEffect, useRef} from 'react';
import {ITemplatePreviewProps} from './TemplatePreview';
import {useMailPreview} from '@/entities/templates/api/queryHook';
import {debounce} from 'lodash';
import {isIFrameElement, setHTML} from '@/shared/lib';

export const EmailPreview: FC<ITemplatePreviewProps> = ({content}) => {
    const {mutateAsync} = useMailPreview();
    const iframe = useRef<HTMLIFrameElement | null>(null);

    const request = async (content?: string) => {
        if (!isIFrameElement(iframe.current)) {
            return;
        }

        if (!content) {
            setHTML(iframe.current, '');
            return;
        }

        const preview = await mutateAsync({content});

        setHTML(iframe.current, preview.content);
    };

    const debouncedFetchResults = useCallback(
        debounce((content?: string) => {
            request(content);
        }, 500),
        [],
    );

    useEffect(() => {
        debouncedFetchResults(content);
    }, [content, debouncedFetchResults]);

    return (
        <iframe
            style={{
                border: 'none',
                flex: 1,
            }}
            ref={iframe}
        />
    );
};
