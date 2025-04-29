import React, { useState } from 'react';
import { Flex, Loader, Switch, Text } from '@gravity-ui/uikit';

import { ICardProps } from '@/shared/ui';

import styles from './withSwitch.module.scss';

type WithSwitchProps = {
    showSwitch?: boolean;
    isChecked?: boolean;
    onCheck?: (checked: boolean) => void;
    error?: string;
    isLoading?: boolean;
};

/**
 * HOC withSwitch, использует Card из shared. Добавляет переключалку рядом с заголовком, включение которой показывает содержимое карточки.
 *
 * Используется для отображения карточки с заголовком и содержимым.
 *
 * @param {string} [props.isChecked] - Флаг для включения/выключения содержимого карточки.
 * @param {string} [props.onCheck] - Функция для обработки переключения содержимого карточки.
 *
 * @returns {JSX.Element}
 */

export const withSwitch = <P extends ICardProps>(WrappedCard: React.ComponentType<P>) => {
    const ComponentWithSwitch: React.FC<P & WithSwitchProps & React.PropsWithChildren> = ({
        showSwitch = true,
        isLoading = false,
        isChecked,
        onCheck,
        error,
        title,
        titleVariant = 'subheader-3',
        children,
        ...props
    }) => {
        const [internalChecked, setInternalChecked] = useState(false);

        return (
            <>
                <WrappedCard
                    {...(props as P)}
                    titleVariant={titleVariant}
                    renderTitle={() => (
                        <div className={styles.header}>
                            <Text variant={titleVariant}>{title}</Text>
                            {showSwitch && !isLoading && (
                                <Switch
                                    checked={isChecked ?? internalChecked}
                                    onUpdate={(checked: boolean) => {
                                        onCheck?.(checked);
                                        setInternalChecked(checked);
                                    }}
                                />
                            )}
                        </div>
                    )}
                >
                    {isLoading ? (
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            height="100px"
                            width="100%"
                        >
                            <Loader size="m" />
                        </Flex>
                    ) : (
                        <>
                            {error && (
                                <div className={styles.error}>
                                    <Text variant="body-1" color="danger">
                                        {error}
                                    </Text>
                                </div>
                            )}
                            {isChecked ?? internalChecked ? children : null}
                        </>
                    )}
                </WrappedCard>
            </>
        );
    };

    return ComponentWithSwitch;
};
