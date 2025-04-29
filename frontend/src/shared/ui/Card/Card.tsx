import React, {ReactNode} from 'react';
import {PopupProps, Text, TextProps} from '@gravity-ui/uikit';
import cn from 'classnames';

import {isString} from '@/shared/lib';

import {FaqButton} from '../FaqButton';

import styles from './Card.module.scss';

export interface ICardProps {
    title?: string | React.ReactNode;
    titleClassName?: string;
    subtitle?: string;
    subtitleVariant?: TextProps['variant'];
    subtitleColor?: TextProps['color'];
    tooltipText?: string;
    className?: string;
    popupProps?: PopupProps;
    titleVariant?: TextProps['variant'];
    action?: React.ReactNode;
    qa?: string;
    shadow?: boolean;
    renderTitle?: () => ReactNode;
}

const Card = (props: ICardProps & React.PropsWithChildren) => {
    const {
        title,
        subtitle,
        subtitleVariant = 'body-1',
        subtitleColor = 'secondary',
        tooltipText,
        titleVariant = 'subheader-3',
        titleClassName,
        popupProps,
        className,
        children,
        action,
        qa,
        shadow,
        renderTitle,
    } = props;

    const renderTitleHandler = () => {
        return (
            <div className={cn(styles.headerContainer, titleClassName)}>
                <div className={styles.textWrapper}>
                    {renderTitle ? (
                        renderTitle()
                    ) : (
                        <>
                            {isString(title) ? <Text variant={titleVariant}>{title}</Text> : title}
                            {subtitle && (
                                <Text variant={subtitleVariant} color={subtitleColor}>
                                    {subtitle}
                                </Text>
                            )}
                        </>
                    )}
                </div>
                {action && action}
                {tooltipText && (
                    <FaqButton
                        tooltipText={tooltipText}
                        popupProps={{...popupProps, hasArrow: true}}
                    />
                )}
            </div>
        );
    };

    return (
        <div
            className={cn(styles.container, className, {
                [styles.shadow]: shadow,
            })}
            data-qa={qa}
        >
            {(title || renderTitle) && renderTitleHandler()}
            {children}
        </div>
    );
};

export default React.memo(Card);
