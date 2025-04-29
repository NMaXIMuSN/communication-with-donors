import {ISearchVariables} from '@/entities/segmnets/api/fetchers';
import {axios} from '@/shared/api/axios';
import {ISearchResponse} from '@/shared/api/type';
import {ELanguage} from '@/shared/ui';

export enum ETemplateType {
    EMAIL = 'EMAIL',
    TELEGRAM = 'TELEGRAM',
}

export interface ISetting {
    lang: ELanguage;
    id: number;
    content: string;
    subject?: string;
}

export interface ITemplate {
    id: number;
    name: string;
    type: ETemplateType;
    description?: string;
    settings: ISetting[];
}

export interface ITemplateSelect {
    id: number;
    name: string;
    type: ETemplateType;
    description?: string;
    settings: Record<ELanguage, ISetting>;
}

export type WithUserInfo<T> = T & {
    createdAt: string;
    updatedAt?: string;
    createdById: number;
    updatedById?: number;
};

export interface ITemplateFilter {
    type: ETemplateType[];
}

export type TCreateTemplate = Omit<ITemplate, 'id' | 'settings'>;

export const searchTemplate = async (
    variables: ISearchVariables<ITemplateFilter>,
): Promise<ISearchResponse<WithUserInfo<ITemplate>>> => {
    const response = await axios.post('/templates/search', variables);
    return response.data;
};

export const cerateTemplate = async (data: TCreateTemplate): Promise<WithUserInfo<ITemplate>> => {
    const response = await axios.post('/templates', data);

    return response.data;
};

export const getTemplate = async (id: number): Promise<WithUserInfo<ITemplate>> => {
    const response = await axios.get(`/templates/${id}`);

    return response.data;
};

export const updateTemplate = async (
    id: number,
    template: ITemplate,
): Promise<WithUserInfo<ITemplate>> => {
    const response = await axios.post(`/templates/${id}`, template);

    return response.data;
};

export const getMailPreview = async ({
    content,
    subject,
}: {
    content: string;
    subject?: string;
}): Promise<{content: string; subject?: string}> => {
    const response = await axios.post(`/mail/preview`, {
        content,
        subject,
    });

    return response.data;
};

export const sendMessageToChat = async ({
    chatId,
    message,
}: {
    chatId: string;
    message: string;
}): Promise<{content: string; subject?: string}> => {
    const response = await axios.post(`/telegram/send`, {
        chatId,
        message,
    });

    return response.data;
};
