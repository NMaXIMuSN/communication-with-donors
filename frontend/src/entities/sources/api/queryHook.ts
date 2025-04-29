import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
    createSource,
    deleteSourceBySystemName,
    fetchSources,
    getAvailableTables,
    getSourceById,
    updateSource,
} from './fetchers';

// Хук для получения списка sources с пагинацией и поиском
export const useSourcesQuery = (page = 1, limit = 10, sort = 'asc', search?: string) => {
    return useQuery({
        queryKey: ['sources', page, limit, sort, search],
        queryFn: () => fetchSources(page, limit, sort, search),
    });
};

// Хук для получения одного source
export const useSourceQuery = (id: string) => {
    return useQuery({
        queryKey: ['source', id],
        queryFn: () => getSourceById(id),
        enabled: Boolean(id),
    });
};

// Хук для получения доступных таблиц
export const useAvailableTables = () => {
    return useQuery({
        queryKey: ['source', 'available', 'tables'],
        queryFn: getAvailableTables,
        select: (data) => {
            if (!data) {
                return data;
            }

            return data.map((el) => ({
                value: el,
                content: el,
            }));
        },
    });
};

// Хук для создания нового source
export const useCreateSourceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSource,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['sources'],
            });
        },
    });
};

// Хук для создания нового source
export const useDeleteSourceMutation = (systemName?: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteSourceBySystemName,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['sources'],
            });
            queryClient.invalidateQueries({
                queryKey: ['sources', systemName],
            });
        },
    });
};

// Хук для обновления source
export const useUpdateSourceMutation = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Parameters<typeof updateSource>[1]) => updateSource(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['sources'],
            });
            queryClient.invalidateQueries({
                queryKey: ['sources', id],
            });
        },
    });
};
