import {ValidationScheme, isRequired} from '@/shared/lib/validation';
import {ICreateCampaign} from '../api/fetch';

export const scheme: ValidationScheme<Partial<ICreateCampaign>> = {
    endAt: [{validationCallback: isRequired, errorMessage: 'Обязательное поле'}],
    segment: [{validationCallback: isRequired, errorMessage: 'Обязательное поле'}],
    startAt: [{validationCallback: isRequired, errorMessage: 'Обязательное поле'}],
    name: [{validationCallback: isRequired, errorMessage: 'Обязательное поле'}],
};
