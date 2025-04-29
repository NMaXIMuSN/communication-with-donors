import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
    ITemplateSelect,
    cerateTemplate,
    getMailPreview,
    getTemplate,
    searchTemplate,
    sendMessageToChat,
    updateTemplate,
} from './fetchers';
import {mapTemplateDtoToForm, mapTemplateFormToDto} from './mapper';

export const useCreateTemplateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cerateTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['templates'],
            });
        },
    });
};

export const useTemplateQuery = (id?: string | number) => {
    return useQuery({
        queryFn: () => getTemplate(Number(id)),
        queryKey: ['templates', id],
        enabled: Boolean(id),
        select: (data) => {
            if (!data) {
                return data;
            }

            return {...data, ...mapTemplateDtoToForm(data)};
        },
    });
};

export const useUpdateTemplateMutation = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ITemplateSelect) =>
            updateTemplate(id, {...data, ...mapTemplateFormToDto(data)}),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['templates'],
            });

            queryClient.invalidateQueries({
                queryKey: ['templates', id],
            });
        },
    });
};

export const useSearchTemplate = () => {
    return useMutation({
        mutationFn: searchTemplate,
    });
};

export const useMailPreview = () => {
    return useMutation({
        mutationFn: getMailPreview,
    });
};

export const useSendMessageToChat = () => {
    return useMutation({
        mutationFn: sendMessageToChat,
    });
};
