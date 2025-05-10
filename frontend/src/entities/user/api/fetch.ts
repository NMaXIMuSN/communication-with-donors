import {ISearchVariables} from '@/entities/segmnets/api/fetchers';
import {axios} from '@/shared/api/axios';
import {ISearchResponse} from '@/shared/api/type';

export const getRegInfo = async (hash?: string): Promise<{email: string}> => {
    const {data} = await axios.get(`/auth/register/info/${hash}`);

    return data;
};

export interface IRegisterData {
    name: string;
    password: string;
}

export const register = async (data: IRegisterData, hash?: string): Promise<{email: string}> => {
    const res = await axios.post(`/auth/register/info/${hash}`, data);

    return res.data;
};

export const search = async (data: IRegisterData): Promise<{email: string}> => {
    const res = await axios.post(`/users/search`, data);

    return res.data;
};

export interface ISearchUsers {
    id: number;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    role: Role[];
}

export interface Role {
    id: number;
    name: string;
}

export const searchUsers = async (
    variables: ISearchVariables,
): Promise<ISearchResponse<ISearchUsers>> => {
    const response = await axios.post('/users/search', variables);
    return response.data;
};

export const addUser = async ({
    email,
    roleIds,
}: {
    email: string;
    roleIds: number[];
}): Promise<void> => {
    await axios.post('/users/add/user', {email, roleIds});
};

export interface IRole {
    id: number;
    name: string;
}
export const getRoles = async (): Promise<IRole[]> => {
    const res = await axios.get('/permissions');

    return res.data;
};

export const logout = async (): Promise<void> => {
    await axios.post(`/auth/logout`);
};

export const updateRole = async ({
    email,
    roleIds,
}: {
    email: string;
    roleIds: number[];
}): Promise<ISearchUsers> => {
    const res = await axios.post(`users/update/role/${email}`, roleIds);
    return res.data;
};
