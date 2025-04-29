import {ELanguage} from '@/shared/ui';
import {ISetting, ITemplate, ITemplateSelect} from './fetchers';

export const mapTemplateFormToDto = (template: ITemplateSelect): ITemplate => ({
    ...template,
    settings: Object.values(template.settings),
});

export const mapTemplateDtoToForm = (template: ITemplate): ITemplateSelect => ({
    ...template,
    settings: Object.fromEntries(template.settings.map((el) => [el.lang, el])) as Record<
        ELanguage,
        ISetting
    >,
});
