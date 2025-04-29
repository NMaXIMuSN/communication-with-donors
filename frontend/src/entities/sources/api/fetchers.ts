import {axios} from '@/shared/api/axios';

export interface Source {
    id: number;
    name: string;
    systemName: string;
    tableName: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    createdById?: number;
    updatedById?: number;
    attributes: IAttribute[];
}

export enum DataType {
    INT = 'INT',
    REAL = 'REAL',
    TEXT = 'TEXT',
    DATE = 'DATE',
    TIME = 'TIME',
    TIMESTAMP = 'TIMESTAMP',
    BOOLEAN = 'BOOLEAN',
}

export enum DataUnit {
    WHERE = 'WHERE',
}

export enum DataControl {
    STRING = 'STRING',
    STRING_SELECT = 'STRING_SELECT',
    INTEGER = 'INTEGER',
    BOOLEAN = 'BOOLEAN',
    DATE = 'DATE',
    GENDER = 'GENDER',
}

export interface IAttribute {
    id?: number;
    sourceId?: number;
    isActive: boolean;
    name?: string;
    systemName: string;
    type: DataType;
    unit: DataUnit;
    control: DataControl;
    allowedValues?: string;
}

export interface PaginatedSources {
    data: Source[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}

// запросы
export const fetchSources = async (
    page = 1,
    limit = 10,
    sort = 'asc',
    search?: string,
): Promise<PaginatedSources> => {
    const response = await axios.get('/source/search', {
        params: {page, limit, sort, search},
    });
    return response.data;
};

export const createSource = async (data: {
    name: string;
    tableName: string;
    description?: string;
    systemName: string;
    attributes?: IAttribute[];
}): Promise<Source> => {
    const response = await axios.post('/source/create', data);
    return response.data;
};

export const updateSource = async (
    id: number,
    data: {
        name?: string;
        tableName?: string;
        description?: string;
        attributes?: IAttribute[];
    },
): Promise<Source & {attributes?: IAttribute[]}> => {
    const response = await axios.patch(`/source/update/${id}`, data);
    return response.data;
};

export const getSourceById = async (id: string): Promise<Source & {attributes: IAttribute[]}> => {
    const response = await axios.get(`/source/${id}`);
    return response.data;
};

export const deleteSourceBySystemName = async (
    systemName: string,
): Promise<Source & {attributes: IAttribute[]}> => {
    const response = await axios.delete(`/source/${systemName}`);
    return response.data;
};

export interface IIableInfo {
    data: Record<string, any>[];
    table: {
        columnName: string;
        dataType: DataType;
    }[];
}

export const getInfoTable = async (name: string): Promise<IIableInfo> => {
    const response = await axios.get(`/source/info/table/${name}`);
    return response.data;
};

export const getAvailableTables = async (): Promise<string[]> => {
    const response = await axios.get('/source/available/tables');

    return response.data;
};
