import {Button, Col, ColProps, Flex, Icon, Row} from '@gravity-ui/uikit';
import {useGeneratePreview} from '@/features/templates/generate-preview/GeneratePreview';
import {FC, ReactNode, useEffect, useRef, useState} from 'react';
import {isIFrameElement, setHTML} from '@/shared/lib';
import {debounce} from 'lodash';
import cn from 'classnames';

import styles from './VitrineTemplate.module.scss';
import {Code, EyeSlash} from '@gravity-ui/icons';

interface IProps {
    headerLeft?: ReactNode;
    headerRight?: ReactNode;
    contentLeft?: ReactNode;
    contentRight?: ReactNode;
}

export const VitrineTemplate: FC<IProps> = (props) => {
    const {contentLeft, contentRight, headerLeft, headerRight} = props;
    const iframe = useRef<HTMLIFrameElement | null>(null);
    const html = useGeneratePreview();

    const drawPreview = debounce(() => {
        if (isIFrameElement(iframe.current)) {
            setHTML(iframe.current, html || 'Нет разметки');
        }
    }, 200);

    const [view, setView] = useState({
        code: true,
        preview: true,
    });

    const leftS = view.code ? (view.preview ? 6 : 12) : 0;
    const rightS = view.preview ? (view.code ? 6 : 12) : 0;
    const leftSHeader = Math.max(1, Math.min(11, leftS));
    const rightSHeader = Math.max(1, Math.min(11, rightS));

    useEffect(() => drawPreview(), [html]);
    return (
        <>
            <Row space={0}>
                <Col s={leftSHeader as ColProps['s']}>
                    <div className={cn(styles.header, styles.headerLeft)}>{headerLeft}</div>
                </Col>
                <Col s={rightSHeader as ColProps['s']}>
                    <div className={styles.header}>
                        <Flex width="100%" justifyContent="space-between">
                            <div>{headerRight}</div>
                            <div>
                                <Button
                                    view={view.code ? 'action' : 'outlined'}
                                    pin="round-clear"
                                    onClick={() => {
                                        if (view.preview) {
                                            setView(({code, preview}) => ({preview, code: !code}));
                                        }
                                    }}
                                >
                                    <Icon data={Code} />
                                </Button>
                                <Button
                                    view={view.preview ? 'action' : 'outlined'}
                                    pin="clear-round"
                                    onClick={() => {
                                        if (view.code) {
                                            setView(({code, preview}) => ({
                                                code,
                                                preview: !preview,
                                            }));
                                        }
                                    }}
                                >
                                    <Icon data={EyeSlash} />
                                </Button>
                            </div>
                        </Flex>
                    </div>
                </Col>

                <Col
                    s={leftS}
                    style={
                        !leftS
                            ? {
                                  display: 'none',
                              }
                            : {}
                    }
                >
                    <div className={cn(styles.content, styles.contentLeft)}>{contentLeft}</div>
                </Col>

                <Col
                    s={rightS}
                    style={
                        !rightS
                            ? {
                                  display: 'none',
                              }
                            : {}
                    }
                >
                    <div className={cn(styles.content, styles.contentRight)}>{contentRight}</div>
                </Col>
            </Row>
        </>
    );
};
