import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {createRole, getRolesInfo, updateRole} from './fetch';

export const useRoleList = () => {
    return useQuery({
        queryFn: getRolesInfo,
        queryKey: ['role', 'info'],
    });
};

export const useCreateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRole,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['role', 'info'],
            });
        },
    });
};

export const useUpdateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateRole,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['role', 'info'],
            });
        },
    });
};
