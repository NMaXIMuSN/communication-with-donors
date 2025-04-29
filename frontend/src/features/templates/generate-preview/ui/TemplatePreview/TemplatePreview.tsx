import {ETemplateType} from '@/entities/templates/api/fetchers';
import {FC} from 'react';
import {EmailPreview} from './EmailPreview';
import {TelegramPreview} from './TelegramPreview';
import {useFormState} from 'react-final-form';
import {ITemplateForm} from '@/entities/templates/model/form';

export interface ITemplatePreviewProps {
    content?: string;
    subject?: string;
}

export const TemplatePreview: FC<{type: ETemplateType}> = ({type}) => {
    const {
        values: {settings, selectLang},
    } = useFormState<ITemplateForm>();
    const content = selectLang ? settings?.[selectLang]?.content : '';
    switch (type) {
        case ETemplateType.EMAIL:
            return <EmailPreview content={content} />;

        case ETemplateType.TELEGRAM:
            return <TelegramPreview content={content} />;

        default:
            throw new Error('Неизвестный тип шаблона');
    }
};
