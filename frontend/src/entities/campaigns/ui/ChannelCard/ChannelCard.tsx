import {FC, ReactNode} from 'react';
import {EChannelType, IChanel} from '../../api/fetch';
import Card from '@/shared/ui/Card/Card';
import {Flex} from '@gravity-ui/uikit';
import {Creative} from '../Creative/Creative';

interface IProps {
    channel: IChanel;
    action: ReactNode;
    addCreative: ReactNode;
    renderDeleteCreative: (id: number) => ReactNode;
}

export const ChannelCard: FC<IProps> = (props) => {
    const {channel, action, addCreative, renderDeleteCreative} = props;

    return (
        <Card
            title={channel.type === EChannelType.EMAIL ? 'Email канал' : 'Telegram канал'}
            action={action}
        >
            <Flex direction="column" gap={2} width={'100%'}>
                {channel.creatives.map((el) => {
                    return (
                        <Creative
                            key={el.id}
                            lang={el.lang}
                            name={el.template.name}
                            campaignId={channel.campaignId}
                            id={el.id}
                            status={el.status}
                            deleteComponent={renderDeleteCreative(el.id)}
                        />
                    );
                })}
                {addCreative}
            </Flex>
        </Card>
    );
};
