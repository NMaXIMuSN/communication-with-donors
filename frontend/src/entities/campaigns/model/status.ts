import {ECampaignStatus} from '../api/fetch';

export const CAMPAIGN_STATUS_TRANSLATION: Record<ECampaignStatus, string> = {
    [ECampaignStatus.ACTIVE]: 'Включена',
    [ECampaignStatus.COMPLETED]: 'Выполнена',
    [ECampaignStatus.DEACTIVATED]: 'Выключена',
};
