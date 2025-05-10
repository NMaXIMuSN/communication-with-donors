import {ISearchUsers} from '@/entities/user/api/fetch';
import {useRoles, useUpdateRole} from '@/entities/user/api/queryHook';
import {toaster} from '@/shared/toaster/notification';
import {FormFieldSelect, FormFieldText, FormRow} from '@/shared/ui';
import ReactFinalForm from '@/shared/ui/form/ReactFinalForm';
import {Dialog, Flex, Label} from '@gravity-ui/uikit';
import {ApiError} from 'next/dist/server/api-utils';
import {FC, useMemo} from 'react';
import {Field} from 'react-final-form';
import {LogOut} from '../log-out/LogOut';
import {useUpdateMe} from '@/shared/providers/userProvider';

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    user?: ISearchUsers;
    isMyEdit?: boolean;
    updateUser: (user: ISearchUsers) => void;
}

export const UserEdit: FC<IProps> = (props) => {
    const {isOpen, onClose, isMyEdit, user, updateUser} = props;

    const {data} = useRoles();

    const {mutateAsync} = useUpdateRole();
    const {mutateAsync: updateMe} = useUpdateMe();

    const initialValues = useMemo(
        () => ({
            ...user,
            role: user?.role.map(({id}) => String(id)),
        }),
        [user],
    );

    const roleOptions = (data || []).map((el) => ({
        value: String(el.id),
        content: el.name,
    }));

    const onSubmit = async (
        values: Omit<ISearchUsers, 'role'> & {
            password?: string;
            newPassword?: string;
            role: string[];
        },
    ) => {
        if (!isMyEdit) {
            try {
                const user = await mutateAsync({
                    email: values.email,
                    roleIds: values.role.map((id) => Number(id)),
                });
                toaster.add({
                    text: 'Роли пользователя изменились',
                });
                updateUser(user);
                onClose();
            } catch (error) {
                if (error instanceof ApiError) {
                    toaster.add({
                        type: 'danger',
                        text: error.message,
                    });
                }
            }
            return;
        }

        try {
            await updateMe({
                name: values.name,
                password: values.password,
                newPassword: values.newPassword,
            });
            toaster.add({
                text: 'Данные обновились',
            });
        } catch (error) {
            if (error instanceof ApiError) {
                toaster.add({
                    text: error.message,
                    type: 'danger',
                });
            }
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} size="m">
            <ReactFinalForm onSubmit={onSubmit} initialValues={initialValues}>
                <Dialog.Header caption="Редоктирование" />
                <Dialog.Body>
                    <FormRow label="Почта">
                        {() => (
                            <Field name="email">
                                {(props) => <FormFieldText disabled {...props} />}
                            </Field>
                        )}
                    </FormRow>
                    <FormRow label="Имя">
                        {() => (
                            <Field name="name">
                                {(props) => <FormFieldText disabled={!isMyEdit} {...props} />}
                            </Field>
                        )}
                    </FormRow>
                    {isMyEdit && (
                        <FormRow label="Старый пароль">
                            {() => (
                                <Field name="password">
                                    {(props) => <FormFieldText type="password" {...props} />}
                                </Field>
                            )}
                        </FormRow>
                    )}
                    {isMyEdit && (
                        <FormRow label="Новый пароль">
                            {() => (
                                <Field name="newPassword">
                                    {(props) => <FormFieldText type="password" {...props} />}
                                </Field>
                            )}
                        </FormRow>
                    )}
                    <FormRow label="Роли">
                        {() => (
                            <Field<string[]> name="role">
                                {(props) => {
                                    if (isMyEdit) {
                                        return (
                                            <Flex>
                                                {roleOptions
                                                    .filter(({value}) =>
                                                        props.input.value.includes(value),
                                                    )
                                                    .map((role) => (
                                                        <Label
                                                            key={role.value}
                                                            children={role.content}
                                                        />
                                                    ))}
                                            </Flex>
                                        );
                                    }

                                    return (
                                        <FormFieldSelect
                                            options={roleOptions}
                                            multiple
                                            {...props}
                                        />
                                    );
                                }}
                            </Field>
                        )}
                    </FormRow>
                </Dialog.Body>
                <Dialog.Footer
                    textButtonApply="Изменить"
                    textButtonCancel="Отмена"
                    onClickButtonCancel={onClose}
                    children={<LogOut />}
                />
            </ReactFinalForm>
        </Dialog>
    );
};
