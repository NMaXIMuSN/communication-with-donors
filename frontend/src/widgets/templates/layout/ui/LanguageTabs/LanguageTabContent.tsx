import {TemplateContext} from '@/entities/templates/model/TemplateContext';
import {VitrineTemplate} from '@/entities/templates/ui/VitrineTemplate/VitrineTemplate';
import {TemplateEditor} from '@/features/templates/generate-preview/ui/TemplateEditor/TemplateEditor';
import {TemplatePreview} from '@/features/templates/generate-preview/ui/TemplatePreview/TemplatePreview';
import {Permissions, useGetPermission} from '@/shared/api/permissions';
import {Alert, Flex} from '@gravity-ui/uikit';
import {useContext} from 'react';

export const LanguageTabContent = () => {
    const {
        state: {template},
    } = useContext(TemplateContext);

    const canEdit = useGetPermission(Permissions.TEMPLATE.EDIT);

    return (
        <VitrineTemplate
            contentLeft={<TemplateEditor canEdit={canEdit} type={template.type} />}
            contentRight={
                <Flex direction="column" gap={2}>
                    <Alert
                        theme="info"
                        title="Построение шаблона"
                        message={`При использовании переменных в шаблоне нужно помнить что данных может не быть у пользователя. \n Для просмотра шаблона переменные заменяются на $i`}
                    />
                    <TemplatePreview type={template.type} />
                </Flex>
            }
        />
    );
};
