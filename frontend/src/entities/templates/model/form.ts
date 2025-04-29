import {ELanguage} from '@/shared/ui';
import {ISetting, ITemplateSelect} from '../api/fetchers';
import {useFormState} from 'react-final-form';

export interface ITemplateForm extends ITemplateSelect {
    selectLang?: ELanguage;
}

export const useGetSettingFieldName = () => {
    const {
        values: {selectLang},
    } = useFormState<ITemplateForm>();

    return (name: string) => `settings.${selectLang || ELanguage.RU}.${name}`;
};

export const DEFAULT_SETTING: Omit<ISetting, 'id'> = {
    content: '',
    subject: '',
    lang: ELanguage.RU,
};
