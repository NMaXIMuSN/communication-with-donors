import {ECampaignStatus} from '@/entities/campaigns/api/fetch';
import {useUpdateCampaignStatusMutation} from '@/entities/campaigns/api/queryHook';
import {CampaignContext} from '@/entities/campaigns/model/CampaignContext';
import {CAMPAIGN_STATUS_TRANSLATION} from '@/entities/campaigns/model/status';
import {toaster} from '@/shared/toaster/notification';
import {Tabs} from '@/shared/ui/Tabs/Tabs';
import {Button, Select} from '@gravity-ui/uikit';
import {FC, PropsWithChildren, useContext, useState} from 'react';
import {CampaignsLogs} from './CampaignsLogs';

interface IProps {
    canEdit?: boolean;
}

const options = Object.values(ECampaignStatus)
    .map((status) => ({
        value: status,
        content: CAMPAIGN_STATUS_TRANSLATION[status],
    }))
    .filter(({value}) => value !== ECampaignStatus.COMPLETED);

export const CampaignsTabs: FC<IProps & PropsWithChildren> = ({canEdit, children}) => {
    const {
        state: {status, campaign},
    } = useContext(CampaignContext);

    const [activeTab, setActiveTab] = useState('campaign');

    const {mutateAsync} = useUpdateCampaignStatusMutation(campaign.id);

    return (
        <Tabs
            tabs={[
                {
                    children,
                    title: 'Кампания',
                    value: 'campaign',
                },
                {
                    title: 'Статистика',
                    value: 'stats',
                    children: <CampaignsLogs id={campaign.id} />,
                },
            ]}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            actions={
                <>
                    <Select
                        options={options}
                        onUpdate={async ([value]) => {
                            if (value === status) {
                                return;
                            }

                            try {
                                const {status} = await mutateAsync(value as ECampaignStatus);
                                toaster.add({
                                    text:
                                        status === ECampaignStatus.ACTIVE
                                            ? 'Кампания включена'
                                            : 'Кампания выключена',
                                });
                            } catch (error) {
                                toaster.add({
                                    type: 'danger',
                                    text: 'Не удалось включить кампанию',
                                });
                            }
                        }}
                        renderControl={({triggerProps}) => {
                            return (
                                <Button
                                    {...triggerProps}
                                    disabled={status === ECampaignStatus.COMPLETED || !canEdit}
                                    view={
                                        status === ECampaignStatus.ACTIVE ||
                                        status === ECampaignStatus.COMPLETED
                                            ? 'action'
                                            : 'flat'
                                    }
                                >
                                    {CAMPAIGN_STATUS_TRANSLATION[status]}
                                </Button>
                            );
                        }}
                    />
                </>
            }
        />
    );
};
