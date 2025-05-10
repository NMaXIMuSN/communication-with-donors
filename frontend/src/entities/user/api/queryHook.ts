import {useMutation, useQuery} from '@tanstack/react-query';
import {
    IRegisterData,
    addUser,
    getRegInfo,
    getRoles,
    logout,
    register,
    searchUsers,
    updateRole,
} from './fetch';
import {useRouter} from 'next/navigation';

export const useRegInfo = (hash?: string) => {
    return useQuery({
        queryFn: () => getRegInfo(hash),
        queryKey: ['regInfo', hash],
    });
};

export const useRoles = () => {
    return useQuery({
        queryFn: getRoles,
        queryKey: ['roles'],
    });
};

export const useRegister = (hash?: string) => {
    return useMutation({
        mutationFn: (data: IRegisterData) => register(data, hash),
    });
};

export const useSearchUsers = () => {
    return useMutation({
        mutationFn: searchUsers,
    });
};

export const useAddUsers = () => {
    return useMutation({
        mutationFn: addUser,
    });
};

export const useLogout = () => {
    const {push} = useRouter();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            push('./login');
        },
    });
};

export const useUpdateRole = () => {
    return useMutation({
        mutationFn: updateRole,
    });
};
