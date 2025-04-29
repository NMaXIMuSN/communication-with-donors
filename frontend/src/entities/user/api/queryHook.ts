import {useMutation, useQuery} from '@tanstack/react-query';
import {IRegisterData, getRegInfo, register} from './fetch';

export const useRegInfo = (hash?: string) => {
    return useQuery({
        queryFn: () => getRegInfo(hash),
        queryKey: ['regInfo', hash],
    });
};

export const useRegister = (hash?: string) => {
    return useMutation({
        mutationFn: (data: IRegisterData) => register(data, hash),
    });
};
