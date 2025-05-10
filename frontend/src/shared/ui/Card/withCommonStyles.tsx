import cn from 'classnames';

import {ICardProps} from '@/shared/ui';

import styles from './withCommonStyles.module.scss';

/**
 * HOC withCommonStyles. Добавляет к Card базовые отступы для всей карточки и заголовка.
 *
 * Используется для отображения карточки с заголовком и содержимым.
 *
 * @param {string} [props.titleVariant] - Вариант заголовка карточки (по умолчанию 'subheader-3').
 * @param {string} [props.titleClassName] - По умолчанию padding-left: 20px, padding-right: 20px;
 * @param {string} [props.className] - По умолчанию padding-top: 20px, padding-bottom: 8px;
 *
 * @returns {JSX.Element}
 */

export const withCommonStyles = <P extends ICardProps>(WrappedCard: React.ComponentType<P>) => {
    const CardWithCommonStyles: React.FC<P & React.PropsWithChildren> = ({
        titleVariant = 'subheader-3',
        titleClassName,
        className,
        children,
        ...props
    }) => {
        return (
            <>
                <WrappedCard
                    {...(props as P)}
                    titleVariant={titleVariant}
                    titleClassName={cn(styles.title, titleClassName)}
                    className={cn(styles.card, className)}
                >
                    {children}
                </WrappedCard>
            </>
        );
    };

    return CardWithCommonStyles;
};
