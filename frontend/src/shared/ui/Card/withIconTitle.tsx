import { FC, PropsWithChildren } from 'react';
import { Icon, Text } from '@gravity-ui/uikit';
import { SVGIconData } from '@gravity-ui/uikit/build/esm/components/Icon/types';
import cn from 'classnames';

import { ICardProps } from './Card';

import styles from './withIconTitle.module.scss';

interface IHocProps {
    icon: SVGIconData;
    iconTheme?: 'info' | 'warning' | 'utility';
}

const IconWrapper = ({ icon, iconTheme = 'info' }: IHocProps) => {
    return (
        <div className={cn(styles.iconWrapper, styles[iconTheme])}>
            <Icon data={icon} />
        </div>
    );
};

/**
 * HOC withIconTitle, использует Card из shared. Добавляет иконку рядом с заголовком.
 *
 * Используется для отображения карточки с заголовком и содержимым.
 *
 * @param {SVGIconData} [props.icon] - svg иконка.
 * @param {'info' | 'warning' | 'utility'} [props.iconTheme] - тема иконки.
 *
 * @returns {JSX.Element}
 */

export const withIconTitle = (
    CardComponent: FC<ICardProps & PropsWithChildren>,
): FC<
    Omit<ICardProps, 'subtitle' | 'subtitleColor' | 'subtitleVariant'> &
        PropsWithChildren &
        IHocProps
> => {
    return (props) => {
        const { title, titleVariant = 'subheader-3', icon, iconTheme, ...otherProps } = props;

        const hocTitleComponent = (
            <div className={styles.titleWithIcon}>
                <IconWrapper iconTheme={iconTheme} icon={icon} />
                <Text variant={titleVariant}>{title}</Text>
            </div>
        );
        return <CardComponent {...otherProps} title={hocTitleComponent} />;
    };
};
