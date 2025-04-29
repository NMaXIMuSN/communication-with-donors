import {EChannelType} from '@/entities/campaigns/api/fetch';
import {useBooleanState} from '@/shared/lib';
import {Plus} from '@gravity-ui/icons';
import {Button, Dialog, Flex, Icon, Text} from '@gravity-ui/uikit';
import cn from 'classnames';
import styles from './AddChannel.module.scss';
import {useCreateChannelMutation} from '@/entities/campaigns/api/queryHook';
import {useContext} from 'react';
import {CampaignContext} from '@/entities/campaigns/model/CampaignContext';

const OPTIONS = [
    {
        title: 'Email канал',
        description:
            'Данный канал будет содержать в себе шаблоны сообщений для email писем.\n После добавления канала, нужно наполнить его шаблонами',
        value: EChannelType.EMAIL,
    },
    {
        title: 'Telegram канал',
        description:
            'Данный канал будет содержать в себе шаблоны сообщений для telegram ботов.\n После добавления канала, нужно наполнить его шаблонами и выбрать telegram бота',
        value: EChannelType.TELEGRAM,
    },
];

export const AddChannel = () => {
    const {
        state: {campaign, channels},
    } = useContext(CampaignContext);
    const [isOpen, onOpen, onClose] = useBooleanState(false);

    const {mutateAsync} = useCreateChannelMutation(campaign.id);

    const addChannel = async (type: EChannelType) => {
        try {
            await mutateAsync(type);
        } catch (error) {}
    };
    return (
        <>
            <Button width="max" onClick={onOpen}>
                <Icon data={Plus} /> Добавить канал
            </Button>
            <Dialog
                open={isOpen}
                onClose={onClose}
                onEscapeKeyDown={onClose}
                onOutsideClick={onClose}
                size="m"
            >
                <Dialog.Header caption="Добавление канала" />
                <Dialog.Body>
                    <Flex direction="column" gap={4}>
                        {OPTIONS.map(({title, value, description}) => (
                            <div
                                className={cn(styles.card, {
                                    [styles.cardDisabled]: channels.some(
                                        ({type}) => type === value,
                                    ),
                                })}
                                key={value}
                                onClick={() => addChannel(value)}
                            >
                                <Text variant="subheader-2" as="div">
                                    {title}
                                </Text>
                                <Text variant="body-short">{description}</Text>
                            </div>
                        ))}
                    </Flex>
                </Dialog.Body>
            </Dialog>
        </>
    );
};
