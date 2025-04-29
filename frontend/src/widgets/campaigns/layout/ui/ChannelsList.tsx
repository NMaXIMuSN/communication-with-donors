import {useAddCreativesToChannelMutation} from '@/entities/campaigns/api/queryHook';
import {CampaignContext} from '@/entities/campaigns/model/CampaignContext';
import {ChannelCard} from '@/entities/campaigns/ui/ChannelCard/ChannelCard';
import {ETemplateType} from '@/entities/templates/api/fetchers';
import {AddChannel} from '@/features/campaigns/add-channel/AddChannel';
import {DeleteChannel} from '@/features/campaigns/delete-channel/DeleteChannel';
import {DeleteCreative} from '@/features/campaigns/delete-creative/DeleteCreative';
import {SearchTemplate} from '@/features/templates/search-template/SearchTemplate';
import Card from '@/shared/ui/Card/Card';
import {Flex} from '@gravity-ui/uikit';
import {FC, useContext} from 'react';

interface IProps {
    canEdit?: boolean;
}

export const ChannelsList: FC<IProps> = ({canEdit}) => {
    const {
        state: {channels, campaign},
    } = useContext(CampaignContext);

    const {mutate} = useAddCreativesToChannelMutation(campaign.id);

    if (!channels.length) {
        return <Card title="Нет каналов">{canEdit && <AddChannel />}</Card>;
    }

    return (
        <Flex direction="column" gap={3}>
            {channels.map((channel) => (
                <ChannelCard
                    key={channel.id}
                    channel={channel}
                    action={
                        canEdit && <DeleteChannel campaignID={campaign.id} channelId={channel.id} />
                    }
                    renderDeleteCreative={(id) => canEdit && <DeleteCreative id={id} />}
                    addCreative={
                        canEdit && (
                            <SearchTemplate
                                onSelectTemplate={(template, lang) => {
                                    mutate(
                                        lang.map((lang) => ({
                                            channelId: channel.id,
                                            templateId: template.id,
                                            lang: lang,
                                            type: channel.type,
                                        })),
                                    );
                                }}
                                type={[channel.type] as unknown as ETemplateType[]}
                            />
                        )
                    }
                />
            ))}
            {canEdit && channels.length < 2 && <AddChannel />}
        </Flex>
    );
};
