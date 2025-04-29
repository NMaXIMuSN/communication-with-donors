import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
    ISegmentWithUserInfo,
    calculatedSegment,
    fetchCreateSegment,
    getSegmentById,
    getStatusSegment,
    searchSegment,
    updateSegmentById,
} from './fetchers';

export const useCreateSegmentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: fetchCreateSegment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['segment'],
            });
        },
    });
};

export const useUpdateSegmentMutation = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ISegmentWithUserInfo) => updateSegmentById(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['segment'],
            });

            queryClient.invalidateQueries({
                queryKey: ['segment', id],
            });
        },
    });
};

export const useCalculatedSegmentMutation = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => calculatedSegment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['segment'],
            });

            queryClient.invalidateQueries({
                queryKey: ['segment', id],
            });

            queryClient.invalidateQueries({
                queryKey: ['segment', id, 'status'],
            });
        },
    });
};

export const useStatusSegmentQuery = (id: number) => {
    return useQuery({
        queryKey: ['segment', id, 'status'],
        queryFn: () => getStatusSegment(id),
        enabled: Boolean(id),
        refetchInterval: 2000,
    });
};

// Хук для получения одного source
export const useSegmentQuery = (id: string) => {
    return useQuery({
        queryKey: ['segment', id],
        queryFn: () => getSegmentById(id),
        enabled: Boolean(id),
    });
};

export const useSearchSegment = () => {
    return useMutation({
        mutationFn: searchSegment,
    });
};
