import {useAddUsers, useRoles} from '@/entities/user/api/queryHook';
import {toaster} from '@/shared/toaster/notification';
import {FormFieldSelect, FormFieldText, FormRow} from '@/shared/ui';
import ReactFinalForm from '@/shared/ui/form/ReactFinalForm';
import {Button, Dialog} from '@gravity-ui/uikit';
import {useState} from 'react';
import {Field} from 'react-final-form';

export const AddUser = () => {
    const [open, setOpen] = useState(false);

    const {mutateAsync} = useAddUsers();
    const {data} = useRoles();

    const options = data?.map((el) => ({
        value: String(el.id),
        content: el.name,
    }));

    const onSubmit = async ({email, role}: {email: string; role: string[]}) => {
        try {
            await mutateAsync({
                email,
                roleIds: role.map((id) => Number(id)),
            });
            toaster.add({
                text: 'Пользователю отправленная ссылка на регистрацию',
            });
        } catch (error) {
            toaster.add({
                type: 'danger',
                // @ts-ignore
                text: error?.message,
            });
        }
    };

    return (
        <>
            <Button view="action" onClick={() => setOpen(true)}>
                Добавить пользователя
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <ReactFinalForm onSubmit={onSubmit}>
                    <Dialog.Header caption="Добавление пользователя" />
                    <Dialog.Body>
                        <FormRow label="Почта">
                            {() => (
                                <Field name="email">
                                    {(props) => <FormFieldText {...props} />}
                                </Field>
                            )}
                        </FormRow>
                        <FormRow label="Роли">
                            {() => (
                                <Field<string[]> name="role">
                                    {(props) => (
                                        <FormFieldSelect
                                            multiple
                                            options={options || []}
                                            {...props}
                                        />
                                    )}
                                </Field>
                            )}
                        </FormRow>
                    </Dialog.Body>
                    <Dialog.Footer textButtonApply="Добавить" />
                </ReactFinalForm>
            </Dialog>
        </>
    );
};
