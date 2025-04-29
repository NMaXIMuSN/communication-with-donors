import {useDeleteCreativesToChannelMutation} from '@/entities/campaigns/api/queryHook';
import {CampaignContext} from '@/entities/campaigns/model/CampaignContext';
import {TrashBin} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';
import {FC, useContext} from 'react';

interface IProps {
    id: number;
}
export const DeleteCreative: FC<IProps> = ({id}) => {
    const {
        state: {campaign},
    } = useContext(CampaignContext);
    const {mutate} = useDeleteCreativesToChannelMutation(campaign.id);

    return (
        <Button view="flat" onClick={() => mutate(id)}>
            <Icon data={TrashBin} />
        </Button>
    );
};
