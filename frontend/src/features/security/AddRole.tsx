import {Action, Entity} from '@/shared/api/permissions';
import {FormFieldCheckbox, FormFieldText, FormRow} from '@/shared/ui';
import ReactFinalForm from '@/shared/ui/form/ReactFinalForm';
import {Button, Dialog, Flex, Text} from '@gravity-ui/uikit';
import {FC, ReactNode, useMemo, useState} from 'react';
import {Field} from 'react-final-form';
import styles from './AddRole.module.scss';
import {IRoleWithPermission} from '@/entities/security/api/fetch';
import {useCreateRole, useUpdateRole} from '@/entities/security/api/queryHook';
import {toaster} from '@/shared/toaster/notification';
import {ApiError} from 'next/dist/server/api-utils';

interface IProps {
    isOpen?: boolean;
    onClose?: () => void;
    initialRole?: IRoleWithPermission;
    renderButton?: () => ReactNode;
}

export const AddRole: FC<IProps> = ({isOpen, onClose, initialRole, renderButton}) => {
    const [open, setOpen] = useState(false);
    const {mutateAsync: create} = useCreateRole();
    const {mutateAsync: update} = useUpdateRole();

    const initialValue = useMemo(() => {
        return {
            name: initialRole?.name,
            permissions: initialRole?.permissions.reduce((acc, cur) => {
                return {
                    ...acc,
                    [cur.value]: true,
                };
            }, {}),
        };
    }, [initialRole]);

    const onSubmit = async (value: {name: string; permissions: Record<string, boolean>}) => {
        const data = {
            name: value.name,
            permissions: Object.keys(value.permissions || {}).filter(
                (key) => value.permissions[key],
            ),
        };
        if (!initialRole) {
            try {
                await create(data);
                toaster.add({
                    text: 'Роль создана',
                });
                onClose?.();
                setOpen(false);
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
            await update({
                id: initialRole.id,
                ...data,
            });
            toaster.add({
                text: 'Роль обновлена',
            });
            onClose?.();
            setOpen(false);
        } catch (error) {
            if (error instanceof ApiError) {
                toaster.add({
                    type: 'danger',
                    text: error.message,
                });
            }
        }
    };
    return (
        <>
            {renderButton ? (
                renderButton()
            ) : (
                <Button onClick={() => setOpen(true)}>Добавить роль</Button>
            )}
            <Dialog
                size="m"
                onClose={() => {
                    setOpen(false);
                    onClose?.();
                }}
                open={isOpen || open}
            >
                <ReactFinalForm onSubmit={onSubmit} initialValues={initialValue}>
                    <Dialog.Header
                        caption={!initialValue ? 'Создание роли' : 'Редактирование роли'}
                    />
                    <Dialog.Body hasBorders className={styles.body}>
                        <Flex direction="column" gap={2}>
                            <FormRow label="Название">
                                {() => (
                                    <Field name="name">
                                        {(props) => <FormFieldText {...props} />}
                                    </Field>
                                )}
                            </FormRow>
                            <div>
                                {Object.values(Entity).map((entity) => {
                                    return (
                                        <Flex key={entity} direction="column" gap={1}>
                                            <Text variant="subheader-2">{entity}</Text>
                                            {Object.values(Action).map((action) => (
                                                <Field<boolean>
                                                    type="checkbox"
                                                    key={`${entity}_${action}`}
                                                    name={`permissions.${entity}_${action}`}
                                                >
                                                    {(props) => (
                                                        <FormFieldCheckbox
                                                            {...props}
                                                            children={action}
                                                        />
                                                    )}
                                                </Field>
                                            ))}
                                        </Flex>
                                    );
                                })}
                            </div>
                        </Flex>
                    </Dialog.Body>
                    <Dialog.Footer
                        textButtonApply="Создать"
                        children={initialValue && <Button size="l">Удалить</Button>}
                    />
                </ReactFinalForm>
            </Dialog>
        </>
    );
};
