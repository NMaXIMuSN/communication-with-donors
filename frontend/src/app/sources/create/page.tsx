'use client';

import {DataTableCard, useCreateSourceMutation} from '@/entities/sources';
import {IAttribute} from '@/entities/sources/api/fetchers';
import {isRequired, matchSystemNamePattern, useValidation} from '@/shared/lib/validation';
import {FormRow} from '@/shared/ui';
import Card from '@/shared/ui/Card/Card';
import ReactFinalForm from '@/shared/ui/form/ReactFinalForm';
import {Breadcrumbs} from '@/widgets/breadcrumbs/ui/Breadcrumbs';
import {Button, Flex, TextArea, TextInput} from '@gravity-ui/uikit';
import {toaster} from '@gravity-ui/uikit/toaster-singleton';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {Field} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import {PageContentWrapper} from '@/widgets/page';
import {Permissions, useGetPermission} from '@/shared/api/permissions';
import {useEffect} from 'react';

interface IFormValue {
    name: string;
    systemName: string;
    description?: string;
    tableName: string;
    createdById: number;
    attributes: IAttribute[];
}

const Sources = () => {
    const {validateForm} = useValidation<Partial<IFormValue>>({
        scheme: {
            name: [
                {validationCallback: isRequired, errorMessage: 'Обязательное поле для заполнения'},
            ],
            systemName: [
                {validationCallback: isRequired, errorMessage: 'Обязательное поле для заполнения'},
                {
                    validationCallback: matchSystemNamePattern(),
                    errorMessage: 'Доступны только латинские буквы, цифры и "_"',
                },
            ],
            tableName: [
                {validationCallback: isRequired, errorMessage: 'Обязательное поле для заполнения'},
                {
                    validationCallback: matchSystemNamePattern(),
                    errorMessage: 'Доступны только латинские буквы, цифры и "_"',
                },
            ],
            description: [],
        },
    });

    const {mutateAsync} = useCreateSourceMutation();
    const {push} = useRouter();

    const onSubmit = async (value: IFormValue) => {
        try {
            const res = await mutateAsync({
                ...value,
                attributes: value.attributes.filter((el) => el.isActive),
            });

            push(`/sources/${res.systemName}`);
        } catch (error) {
            toaster.add({
                name: 'error',
                content: 'Не удалось создать источник',
            });
        }
    };

    const canCreate = useGetPermission(Permissions.SOURCE.CREATE);
    useEffect(() => {
        if (!canCreate) {
            push('/403');
        }
    }, [canCreate]);

    return (
        <div>
            <Breadcrumbs
                items={[
                    {href: '/sources', text: 'Источники'},
                    {href: '/sources/create', text: 'Создание источника'},
                ]}
            />

            <ReactFinalForm<IFormValue>
                validate={validateForm}
                onSubmit={onSubmit}
                mutators={{
                    ...arrayMutators,
                }}
            >
                {() => (
                    <PageContentWrapper>
                        <Flex direction={'column'} gap={2}>
                            <DataTableCard />
                            <Card title={'Основная информация'}>
                                <>
                                    <FormRow label="Название" required>
                                        {(id) => (
                                            <Field name="name">
                                                {({input, meta}) => (
                                                    <TextInput
                                                        {...input}
                                                        id={id}
                                                        type="text"
                                                        placeholder="Название"
                                                        validationState={
                                                            meta.touched && meta.error
                                                                ? 'invalid'
                                                                : undefined
                                                        }
                                                        errorMessage={
                                                            meta.touched && meta.error
                                                                ? meta.error
                                                                : undefined
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        )}
                                    </FormRow>
                                    <FormRow label="Системное название" required>
                                        {(id) => (
                                            <Field name="systemName">
                                                {({input, meta}) => (
                                                    <TextInput
                                                        {...input}
                                                        id={id}
                                                        type="text"
                                                        placeholder="Системное название"
                                                        validationState={
                                                            meta.touched && meta.error
                                                                ? 'invalid'
                                                                : undefined
                                                        }
                                                        errorMessage={
                                                            meta.touched && meta.error
                                                                ? meta.error
                                                                : undefined
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        )}
                                    </FormRow>
                                    <FormRow label="Описание">
                                        {(id) => (
                                            <Field name="description">
                                                {({input, meta}) => (
                                                    <TextArea
                                                        {...input}
                                                        id={id}
                                                        placeholder="Описание"
                                                        validationState={
                                                            meta.touched && meta.error
                                                                ? 'invalid'
                                                                : undefined
                                                        }
                                                        rows={4}
                                                        errorMessage={
                                                            meta.touched && meta.error
                                                                ? meta.error
                                                                : undefined
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        )}
                                    </FormRow>
                                </>
                            </Card>
                            <Flex gap={2} spacing={{mt: 2}}>
                                <Link href={'/sources'}>
                                    <Button size="l">Отмена</Button>
                                </Link>
                                <Button size="l" view="action" type="submit">
                                    Создать
                                </Button>
                            </Flex>
                        </Flex>
                    </PageContentWrapper>
                )}
            </ReactFinalForm>
        </div>
    );
};

export default Sources;
