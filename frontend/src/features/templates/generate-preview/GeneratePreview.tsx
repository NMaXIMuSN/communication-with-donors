import {ITemplateForm} from '@/entities/templates/model/form';
import {useFormState} from 'react-final-form';

export const useGeneratePreview = () => {
    const {
        values: {settings, selectLang},
    } = useFormState<ITemplateForm>();

    if (!selectLang) {
        return '<html><p style="color: red">Разметка отсутствует</p>}</html>';
    }

    return `<html>${settings?.[selectLang]?.content}</html>`;
};
