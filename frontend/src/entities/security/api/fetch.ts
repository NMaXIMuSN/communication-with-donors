import {IRole} from '@/entities/user/api/fetch';
import {axios} from '@/shared/api/axios';

export interface IRoleWithPermission extends IRole {
    permissions: {id: number; value: string}[];
}

export const getRolesInfo = async (): Promise<IRoleWithPermission[]> => {
    const res = await axios.get('/permissions/info');

    return res.data;
};

export const createRole = async (value: {
    name: string;
    permissions: string[];
}): Promise<IRoleWithPermission[]> => {
    const res = await axios.post('/permissions/create', value);

    return res.data;
};

export const updateRole = async ({
    id,
    ...value
}: {
    name: string;
    id: number;
    permissions: string[];
}): Promise<IRoleWithPermission[]> => {
    const res = await axios.post(`/permissions/update/${id}`, value);

    return res.data;
};
