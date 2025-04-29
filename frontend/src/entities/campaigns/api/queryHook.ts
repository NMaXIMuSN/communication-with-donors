import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
    ECampaignStatus,
    EChannelType,
    IAddCreative,
    ICampaignUpdate,
    addCreatives,
    channelCreativeStatus,
    createCampaign,
    createChannel,
    deleteChannel,
    deleteCreatives,
    getCampaign,
    getCampaignsLog,
    getChannels,
    getStatus,
    searchCampaigns,
    updateCampaign,
    updateStatus,
} from './fetch';

export const useCreateCampaignMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCampaign,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['campaigns'],
            });
        },
    });
};

export const useCampaignQuery = (id: string) => {
    return useQuery({
        queryFn: () => getCampaign(Number(id)),
        queryKey: ['campaigns', id],
        enabled: Boolean(id),
    });
};

export const useCampaignChannelsQuery = (id: number) => {
    return useQuery({
        queryFn: () => getChannels(id),
        queryKey: ['campaigns', id, 'channels'],
        enabled: Boolean(id),
    });
};

export const useCampaignStatusQuery = (id: number) => {
    return useQuery({
        queryFn: () => getStatus(id),
        queryKey: ['campaigns', id, 'status'],
        enabled: Boolean(id),
        refetchInterval: 2000,
    });
};

export const useCampaignLogQuery = (id: number) => {
    return useQuery({
        queryFn: () => getCampaignsLog(id),
        queryKey: ['campaigns', id, 'log'],
        enabled: Boolean(id),
    });
};

export const useUpdateCampaignStatusMutation = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (status: ECampaignStatus) => updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['campaigns', id, 'status'],
            });
        },
    });
};

export const useCreateChannelMutation = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (type: EChannelType) => createChannel(id, type),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['campaigns', id, 'channels'],
            });
        },
    });
};

export const useDeleteChannelMutation = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (channelId: number) => deleteChannel(id, channelId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['campaigns', id, 'channels'],
            });
        },
    });
};

export const useAddCreativesToChannelMutation = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IAddCreative[]) => addCreatives(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['campaigns', id, 'channels'],
            });
        },
    });
};

export const useDeleteCreativesToChannelMutation = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (creativeId: number) => deleteCreatives(id, creativeId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['campaigns', id, 'channels'],
            });
        },
    });
};

export const useChannelCreativeStatusMutation = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (creativeId: number) => channelCreativeStatus(id, creativeId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['campaigns', id, 'channels'],
            });
        },
    });
};

export const useUpdateCampaignMutation = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (creativeId: ICampaignUpdate) => updateCampaign(id, creativeId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['campaigns', id],
            });
        },
    });
};

export const useSearchCampaigns = () => {
    return useMutation({
        mutationFn: searchCampaigns,
    });
};
