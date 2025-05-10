'use client';

import {EMPTY_DASH} from '@/shared/ui';
import {Breadcrumbs} from '@/widgets/breadcrumbs/ui/Breadcrumbs';
import {PageContentWrapper} from '@/widgets/page';
import {EntityPage} from '@/widgets/page/ui/EntityPage';

import {Button, Icon, Loader, Overlay} from '@gravity-ui/uikit';
import dayjs from 'dayjs';
import {useParams, useRouter} from 'next/navigation';

import React, {useEffect} from 'react';
import {TrashBin} from '@gravity-ui/icons';
import {TEMPLATES} from '@/shared/route';
import {useTemplateQuery} from '@/entities/templates/api/queryHook';
import {LanguageTabs, TemplateForm} from '@/widgets/templates/layout';
import {TemplateContextProvider} from '@/entities/templates/model/TemplateContext';
import {LanguageTabContent} from '@/widgets/templates/layout/ui/LanguageTabs/LanguageTabContent';
import {Permissions, useGetPermission} from '@/shared/api/permissions';

const FORM_ID = 'FORM_TEMPLATE';

const Template = () => {
    const {id} = useParams<{id: string}>();

    const {data, isLoading} = useTemplateQuery(id);

    const canEdit = useGetPermission(Permissions.TEMPLATE.EDIT);
    const canDelete = useGetPermission(Permissions.TEMPLATE.DELETE);

    const {push} = useRouter();

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

    return (
        <div>
            <Breadcrumbs
                items={[
                    {href: TEMPLATES, text: 'Шаблоны'},
                    {href: '#', text: data?.name || ''},
                ]}
                actionsComponent={
                    <>
                        {canEdit && (
                            <Button form={FORM_ID} view="action" type="submit">
                                Сохранить шаблон
                            </Button>
                        )}

                        {canDelete && (
                            <Button view="flat-secondary">
                                <Icon data={TrashBin} />
                            </Button>
                        )}
                    </>
                }
            />
            <PageContentWrapper>
                <EntityPage
                    title={data?.name || ''}
                    description={data.description}
                    extraTags={[
                        {
                            label: 'ID',
                            value: data.id?.toString() || '',
                        },
                        {
                            label: 'Автор',
                            value: data.createdById?.toString() || EMPTY_DASH,
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
                    <TemplateContextProvider data={data}>
                        <TemplateForm formId={FORM_ID}>
                            <LanguageTabs>
                                <LanguageTabContent />
                            </LanguageTabs>
                        </TemplateForm>
                    </TemplateContextProvider>
                </EntityPage>
            </PageContentWrapper>
        </div>
    );
};

export default Template;
