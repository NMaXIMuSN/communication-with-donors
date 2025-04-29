import {ValidationScheme, isRequired} from '@/shared/lib/validation';
import {TCreateTemplate} from '../api/fetchers';

export const scheme: ValidationScheme<Partial<TCreateTemplate>> = {
    name: [{validationCallback: isRequired, errorMessage: 'Обязательное поле'}],
    description: [],
    type: [{validationCallback: isRequired, errorMessage: 'Обязательное поле'}],
};
