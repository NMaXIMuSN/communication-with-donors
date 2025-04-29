import {ETemplateType} from '@/entities/templates/api/fetchers';
import {FC} from 'react';
import {EmailEditor} from './EmailEditor';
import {TelegramEditor} from './TelegramEditor';

interface IProps {
    type: ETemplateType;
    canEdit?: boolean;
}

export interface IEditorProps {
    canEdit?: boolean;
}
export const TemplateEditor: FC<IProps> = ({type, canEdit}) => {
    switch (type) {
        case ETemplateType.EMAIL:
            return <EmailEditor canEdit={canEdit} />;

        case ETemplateType.TELEGRAM:
            return <TelegramEditor canEdit={canEdit} />;
        default:
            throw new Error('Неизвестный тип шаблона');
    }
};
