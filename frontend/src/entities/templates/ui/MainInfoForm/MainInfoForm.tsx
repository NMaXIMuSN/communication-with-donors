import {FormFieldText, FormRow} from '@/shared/ui';
import Card from '@/shared/ui/Card/Card';
import {FormFieldSegmentedRadioGroup} from '@/shared/ui/form/ui/FormFieldSegmentedRadioGroup/FormFieldSegmentedRadioGroup';
import {FormFieldTextArea} from '@/shared/ui/form/ui/FormFieldTextArea';
import {Field} from 'react-final-form';
import {ETemplateType} from '../../api/fetchers';
import {TEMPLATE_TYPE_TEXT} from '../translations';

const OPTIONS = [
    {
        value: ETemplateType.EMAIL,
        content: TEMPLATE_TYPE_TEXT[ETemplateType.EMAIL],
    },
    {
        value: ETemplateType.TELEGRAM,
        content: TEMPLATE_TYPE_TEXT[ETemplateType.TELEGRAM],
    },
];

export const MainInfoForm = () => {
    return (
        <Card title="Основная информация">
            <FormRow label="Название" required>
                {() => <Field name="name">{(props) => <FormFieldText {...props} />}</Field>}
            </FormRow>
            <FormRow label="Описание">
                {() => (
                    <Field name="description">
                        {(props) => <FormFieldTextArea {...props} rows={3} />}
                    </Field>
                )}
            </FormRow>
            <FormRow label="Тип" required>
                {() => (
                    <Field name="type" defaultValue={ETemplateType.EMAIL} type="radio">
                        {(props) => <FormFieldSegmentedRadioGroup {...props} options={OPTIONS} />}
                    </Field>
                )}
            </FormRow>
        </Card>
    );
};
