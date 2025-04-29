import {FormFieldText, FormRow} from '@/shared/ui';
import Card from '@/shared/ui/Card/Card';
import {FormFieldTextArea} from '@/shared/ui/form/ui/FormFieldTextArea';
import {Field} from 'react-final-form';

export const MainInfoForm = () => {
    return (
        <Card title="Основная информация">
            <FormRow label="Название">
                {(id) => (
                    <Field name="name">{(props) => <FormFieldText {...props} id={id} />}</Field>
                )}
            </FormRow>
            <FormRow label="Описание">
                {(id) => (
                    <Field name="description">
                        {(props) => <FormFieldTextArea {...props} id={id} />}
                    </Field>
                )}
            </FormRow>
        </Card>
    );
};
