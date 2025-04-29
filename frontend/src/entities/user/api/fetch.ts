import {axios} from '@/shared/api/axios';

export const getRegInfo = async (hash?: string): Promise<{email: string}> => {
    const {data} = await axios.get(`/users/register/info/${hash}`);

    return data;
};

export interface IRegisterData {
    name: string;
    password: string;
}

export const register = async (data: IRegisterData, hash?: string): Promise<{email: string}> => {
    const res = await axios.post(`/users/register/info/${hash}`, data);

    return res.data;
};
