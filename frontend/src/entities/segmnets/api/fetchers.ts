import {Source} from '@/entities/sources/api/fetchers';
import {axios} from '@/shared/api/axios';
import {ISearchResponse} from '@/shared/api/type';

export type SegmentFilter = {
    not: boolean;
    rules: SegmentFilterElem[];
    condition: 'OR' | 'AND';
};

export enum SegmentStatus {
    DRAFT = 'DRAFT',
    ERROR = 'ERROR',
    CALCULATED = 'CALCULATED',
    PROGRESS = 'PROGRESS',
}

export type SegmentFilterData = {
    importAttrName?: string;
    importGroupName?: string;
};
export type SegmentFilterRule = {
    id?: string;
    field?: string;
    type?: string;
    operator?: string;
    value?: Record<string, any>;
    data?: SegmentFilterData;
};
export type SegmentFilterElem = SegmentFilter | SegmentFilterRule;

export interface ISegment {
    id?: number;
    name?: string;
    filter?: SegmentFilter;
    sourceId?: number[];
    source?: Source[];
    description?: string;
    limit?: number;
}

export interface ISegmentWithUserInfo extends ISegment {
    createdAt?: string;
    updatedAt?: string;
    createdById?: number;
    updatedById?: number;
}

export const fetchCreateSegment = async (segmentData: ISegment) => {
    const {data} = await axios.post('/segments', {
        name: segmentData.name,
        description: segmentData.description,
        sourceId: segmentData.sourceId,
    });

    return data;
};

export const getSegmentById = async (id: string): Promise<ISegmentWithUserInfo> => {
    const {data} = await axios.get(`/segments/${id}`);

    return data;
};

export const updateSegmentById = async (
    id: number,
    _data: ISegmentWithUserInfo,
): Promise<ISegmentWithUserInfo> => {
    const {data} = await axios.post(`/segments/${id}`, _data);

    return data;
};

export interface ISearchVariables<T = {}> {
    offset?: number;
    limit?: number;
    search?: string;
    sort?: Record<string, 'asc' | 'desc'>;
    filter?: T;
}

export const searchSegment = async ({
    offset,
    limit,
    search,
    sort,
}: ISearchVariables): Promise<ISearchResponse<ISegmentWithUserInfo>> => {
    const {data} = await axios.request({
        url: '/segments/search',
        data: {
            offset,
            limit,
            search,
            sort,
        },
        method: 'POST',
    });
    return data;
};

export const calculatedSegment = async (id: number): Promise<void> => {
    await axios.post(`/segments/${id}/calculation`);
};

export const getStatusSegment = async (
    id: number,
): Promise<{
    status: SegmentStatus;
    lastCalcInfo: number;
}> => {
    const {data} = await axios.get(`/segments/${id}/status`);

    return data;
};
