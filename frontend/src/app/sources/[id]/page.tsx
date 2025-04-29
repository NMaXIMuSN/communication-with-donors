'use client';

import {
    DEFAULT_ATTRIBUTE,
    useDeleteSourceMutation,
    useSourceQuery,
    useUpdateSourceMutation,
} from '@/entities/sources';
import {FieldArray} from 'react-final-form-arrays';

import {EMPTY_DASH} from '@/shared/ui';
import Card from '@/shared/ui/Card/Card';
import ReactFinalForm from '@/shared/ui/form/ReactFinalForm';
import {Breadcrumbs} from '@/widgets/breadcrumbs/ui/Breadcrumbs';
import {PageContentWrapper} from '@/widgets/page';
import {EntityPage} from '@/widgets/page/ui/EntityPage';

import {Button, Flex, Icon, Loader, Overlay, Text} from '@gravity-ui/uikit';
import dayjs from 'dayjs';
import Link from 'next/link';
import {useParams, useRouter} from 'next/navigation';

import arrayMutators from 'final-form-arrays';
import React, {useEffect} from 'react';
import {Plus, TrashBin} from '@gravity-ui/icons';
import {type IAttribute} from '@/entities/sources/api/fetchers';
import {toaster} from '@gravity-ui/uikit/toaster-singleton';
import {SOURCES} from '@/shared/route';
import {Attribute} from '@/entities/sources/ui/Attribute/Attribute';
import {Permissions, useGetPermission} from '@/shared/api/permissions';

interface IFormValue {
    attributes: IAttribute[];
}

const Sources = () => {
    const {push} = useRouter();
    const {id} = useParams<{id: string}>();

    const canEdit = useGetPermission(Permissions.SOURCE.EDIT);
    const canDelete = useGetPermission(Permissions.SOURCE.DELETE);

    const {data, isLoading} = useSourceQuery(id);

    const {mutateAsync} = useUpdateSourceMutation(data?.id || 1);
    const {mutateAsync: deleteSourceMutation} = useDeleteSourceMutation(data?.systemName);

    const onDelete = async () => {
        try {
            await deleteSourceMutation(id);
            push(SOURCES);
        } catch (error) {
            toaster.add({
                name: 'error',
                theme: 'danger',
                content: 'Произошла ошибка сохранения атрибутов',
            });
        }
    };

    useEffect(() => {
        if (!canEdit) {
            push('/403');
        }
    }, [canEdit]);

    if (isLoading || !data) {
        return (
            <Overlay>
                <Loader size="l" />
            </Overlay>
        );
    }

    const onSubmit = async (value: IFormValue) => {
        try {
            await mutateAsync({
                attributes: value.attributes,
                description: data.description,
                name: data.name,
                tableName: data.tableName,
            });

            toaster.add({
                name: 'success',
                theme: 'success',
                content: 'Аттрибуты сохранены',
            });
        } catch (error) {
            toaster.add({
                name: 'error',
                theme: 'danger',
                content: 'Произошла ошибка сохранения атрибутов',
            });
        }
    };

    return (
        <div>
            <Breadcrumbs
                items={[
                    {href: '/sources', text: 'Источники'},
                    {href: '#', text: data.name},
                ]}
                actionsComponent={
                    <>
                        {canEdit && (
                            <Link href={`/sources/${data.systemName}/edit`}>
                                <Button view="action">Редактировать источника</Button>
                            </Link>
                        )}

                        {canDelete && (
                            <Button view="flat-secondary" onClick={onDelete}>
                                <Icon data={TrashBin} />
                            </Button>
                        )}
                    </>
                }
            />
            <PageContentWrapper>
                <EntityPage
                    title={data.name}
                    description={data.description}
                    extraTags={[
                        {
                            label: 'ID',
                            value: data.id.toString(),
                        },
                        {
                            label: 'Автор',
                            value: data.createdById?.toString() || EMPTY_DASH,
                        },
                        {
                            label: 'Последний редактор',
                            value: data.updatedById?.toString() || EMPTY_DASH,
                        },
                        {
                            label: 'Дата создания',
                            value: dayjs(data.createdAt).format('DD.MM.YYYY'),
                        },
                        {
                            label: 'Дата обновления',
                            value: data.updatedAt
                                ? dayjs(data.updatedAt).format('DD.MM.YYYY')
                                : EMPTY_DASH,
                        },
                    ]}
                >
                    <Card
                        title={'Атрибуты'}
                        action={
                            canEdit && (
                                <Button form="attributes" type={'submit'} view="action">
                                    Сохранить
                                </Button>
                            )
                        }
                    >
                        <div>
                            <Text variant="body-2">Таблица {data.tableName}</Text>
                        </div>

                        <ReactFinalForm<IFormValue>
                            onSubmit={onSubmit}
                            formId="attributes"
                            initialValues={{attributes: data.attributes}}
                            mutators={{
                                ...arrayMutators,
                            }}
                        >
                            {() => (
                                <>
                                    <FieldArray name="attributes">
                                        {({fields}) => (
                                            <>
                                                <Flex spacing={{mt: 2}} direction="column" gap={2}>
                                                    {fields.map((name) => (
                                                        <Attribute
                                                            key={name}
                                                            prefix={name}
                                                            canEdit={canEdit}
                                                        />
                                                    ))}
                                                </Flex>
                                                {canEdit && (
                                                    <Flex gap={3} spacing={{mt: 3}}>
                                                        <Button
                                                            view="action"
                                                            onClick={() =>
                                                                fields.push(DEFAULT_ATTRIBUTE)
                                                            }
                                                        >
                                                            <Icon data={Plus} />
                                                            Добавить атрибут
                                                        </Button>
                                                    </Flex>
                                                )}
                                            </>
                                        )}
                                    </FieldArray>
                                </>
                            )}
                        </ReactFinalForm>
                    </Card>
                </EntityPage>
            </PageContentWrapper>
        </div>
    );
};

export default Sources;
