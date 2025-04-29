import {ITemplateForm} from '@/entities/templates/model/form';
import {TemplateContext} from '@/entities/templates/model/TemplateContext';
import {ELanguage} from '@/shared/ui';
import ReactFinalForm from '@/shared/ui/form/ReactFinalForm';
import {FC, PropsWithChildren, useContext, useMemo} from 'react';

interface IProps {
    formId: string;
}

export const TemplateForm: FC<IProps & PropsWithChildren> = ({children, formId}) => {
    const {
        state: {template},
        actions: {onUpdate},
    } = useContext(TemplateContext);

    const initialValues = useMemo<ITemplateForm>(
        () => ({
            id: template.id,
            name: template.name,
            settings: template.settings,
            type: template.type,
            description: template.description,
            selectLang: (Object.keys(template.settings) as ELanguage[])?.[0],
        }),
        [template],
    );
    return (
        <ReactFinalForm<ITemplateForm>
            formId={formId}
            initialValues={initialValues}
            onSubmit={onUpdate}
        >
            {() => <>{children}</>}
        </ReactFinalForm>
    );
};
