import {useDeleteChannelMutation} from '@/entities/campaigns/api/queryHook';
import {TrashBin} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';
import {FC} from 'react';

interface IProps {
    channelId: number;
    campaignID: number;
}

export const DeleteChannel: FC<IProps> = ({campaignID, channelId}) => {
    const {mutate} = useDeleteChannelMutation(campaignID);

    return (
        <Button view="flat" onClick={() => mutate(channelId)}>
            <Icon data={TrashBin} />
        </Button>
    );
};
