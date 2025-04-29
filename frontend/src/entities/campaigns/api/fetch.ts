import {ISearchVariables, ISegment} from '@/entities/segmnets/api/fetchers';
import {ITemplate} from '@/entities/templates/api/fetchers';
import {axios} from '@/shared/api/axios';
import {ISearchResponse} from '@/shared/api/type';
import {extractValueFromBrackets} from '@/shared/lib';
import {ELanguage} from '@/shared/ui';

export interface ICreateCampaign {
    name: string;
    startAt: string;
    endAt: string;
    segment: string;
    description?: string;
}

export enum ECampaignStatus {
    DEACTIVATED = 'DEACTIVATED',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
}

export enum ECreativeStatus {
    DEACTIVATED = 'DEACTIVATED',
    ACTIVE = 'ACTIVE',
}

export interface ICampaign {
    id: number;
    name: string;
    description?: string;
    startAt: string;
    endAt: string;
    status: ECampaignStatus;
    segmentId: number;
    createdAt: string;
    updatedAt?: string;
    createdById?: number;
    segment: Required<ISegment>;
}

export enum EChannelType {
    EMAIL = 'EMAIL',
    TELEGRAM = 'TELEGRAM',
}

export interface IChanel {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    type: EChannelType;
    campaignId: number;
    creatives: ICreative[];
}

export interface ICreative {
    lang: ELanguage;
    channelId: number;
    templateId: number;
    template: ITemplate;
    id: number;
    status: ECreativeStatus;
}

export interface IAddCreative {
    type: EChannelType;
    channelId: number;
    templateId: number;
    lang: ELanguage;
}

export const createCampaign = async (campaign: ICreateCampaign): Promise<ICampaign> => {
    const response = await axios.post('/campaigns', {
        name: campaign.name,
        startAt: campaign.startAt,
        endAt: campaign.endAt,
        segmentId: Number(extractValueFromBrackets(campaign.segment)),
        description: campaign.description,
    });

    return response.data;
};

export const getCampaign = async (campaignId: number): Promise<ICampaign> => {
    const response = await axios.get(`/campaigns/${campaignId}`);

    return response.data;
};

export const getChannels = async (campaignId: number): Promise<IChanel[]> => {
    const response = await axios.get(`/campaigns/${campaignId}/channels`);

    return response.data;
};

export const createChannel = async (campaignId: number, type: EChannelType): Promise<IChanel[]> => {
    const response = await axios.post(`/campaigns/${campaignId}/channels`, {type});

    return response.data;
};

export const deleteChannel = async (campaignId: number, channelId: number): Promise<IChanel[]> => {
    const response = await axios.delete(`/campaigns/${campaignId}/channel/${channelId}`);

    return response.data;
};

export const channelCreativeStatus = async (
    campaignId: number,
    creativeId: number,
): Promise<void> => {
    //:id/channels/creatives/:creativeId/status
    await axios.post(`/campaigns/${campaignId}/channels/creatives/${creativeId}/status`);
};

export const addCreatives = async (campaignId: number, data: IAddCreative[]): Promise<void> => {
    await axios.post(`/campaigns/${campaignId}/channels/creatives/add`, data);
};

export const deleteCreatives = async (campaignId: number, creativeId: number): Promise<void> => {
    await axios.delete(`/campaigns/${campaignId}/channels/creatives/${creativeId}`);
};

export const getStatus = async (campaignId: number): Promise<{status: ECampaignStatus}> => {
    const {data} = await axios.get(`/campaigns/${campaignId}/status`);

    return data;
};

export const updateStatus = async (
    campaignId: number,
    status: ECampaignStatus,
): Promise<{status: ECampaignStatus}> => {
    const {data} = await axios.post(`/campaigns/${campaignId}/status`, {status});

    return data;
};

export interface ICampaignUpdate {
    segmentId?: number;
    name?: string;
    description?: string;
    startAt: string;
    endAt: string;
}

export const updateCampaign = async (id: number, data: ICampaignUpdate): Promise<void> => {
    await axios.post(`/campaigns/${id}`, data);
};

export interface ICampaignsFilter {
    channels?: EChannelType;
}

export interface ISearchCampaigns extends ICampaign {
    campaignChannels: Omit<IChanel, 'creatives'>[];
}

export const searchCampaigns = async (
    variables: ISearchVariables<ICampaignsFilter>,
): Promise<ISearchResponse<ISearchCampaigns>> => {
    const response = await axios.post('/campaigns/search', variables);
    return response.data;
};

export const getCampaignsLog = async (id: number): Promise<any[]> => {
    const response = await axios.get(`/offers/${id}/status`);
    return response.data;
};
