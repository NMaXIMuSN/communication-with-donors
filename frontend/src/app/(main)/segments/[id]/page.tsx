'use client';

import {EMPTY_DASH} from '@/shared/ui';
import {Breadcrumbs} from '@/widgets/breadcrumbs/ui/Breadcrumbs';
import {PageContentWrapper} from '@/widgets/page';
import {EntityPage} from '@/widgets/page/ui/EntityPage';

import {Button, Icon, Label, Loader, Overlay} from '@gravity-ui/uikit';
import dayjs from 'dayjs';
import Link from 'next/link';
import {useParams, useRouter} from 'next/navigation';

import React, {useEffect} from 'react';
import {TrashBin} from '@gravity-ui/icons';
import {useSegmentQuery, useStatusSegmentQuery} from '@/entities/segmnets/api/queryHook';
import {EDIT_SEGMENTS, SEGMENTS} from '@/shared/route';
import {SegmentQueryBuilder} from '@/widgets/segments/layout/SegmentQueryBuilder';
import {SegmentContextProvider} from '@/entities/segmnets/model/SegmentContext';
import {SEGMENT_STATUS_TRANSLATION, StatusTheme} from '@/entities/segmnets/model/status';
import {SegmentStatus} from '@/entities/segmnets/api/fetchers';
import {Permissions, useGetPermission} from '@/shared/api/permissions';

const Sources = () => {
    const {id} = useParams<{id: string}>();

    const canEdit = useGetPermission(Permissions.SEGMENT.EDIT);
    const canDelete = useGetPermission(Permissions.SEGMENT.DELETE);
    const {push} = useRouter();

    const {data, isLoading} = useSegmentQuery(id);
    const {
        data: status = {
            status: SegmentStatus.DRAFT,
            lastCalcInfo: 0,
        },
    } = useStatusSegmentQuery(Number(id));

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
                    {href: SEGMENTS, text: 'Сегменты'},
                    {href: '#', text: data?.name || ''},
                ]}
                actionsComponent={
                    <>
                        {canEdit && (
                            <Link href={EDIT_SEGMENTS(data.id!)}>
                                <Button view="action">Редактировать сегмент</Button>
                            </Link>
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
                            label: 'Статус',
                            value: (
                                <Label
                                    children={SEGMENT_STATUS_TRANSLATION[status.status]}
                                    theme={StatusTheme[status.status]}
                                />
                            ),
                        },
                        ...(status.status === SegmentStatus.CALCULATED
                            ? [
                                  {
                                      label: 'Кол-во доноров',
                                      value: status.lastCalcInfo,
                                  },
                              ]
                            : []),
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
                    <SegmentContextProvider canEdit={canEdit} segment={data}>
                        <SegmentQueryBuilder canEdit={canEdit} />
                    </SegmentContextProvider>
                </EntityPage>
            </PageContentWrapper>
        </div>
    );
};

export default Sources;
