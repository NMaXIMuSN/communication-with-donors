'use client';

import {EMPTY_DASH} from '@/shared/ui';
import {Breadcrumbs} from '@/widgets/breadcrumbs/ui/Breadcrumbs';
import {PageContentWrapper} from '@/widgets/page';
import {EntityPage} from '@/widgets/page/ui/EntityPage';

import {Button, Icon, Loader, Overlay} from '@gravity-ui/uikit';
import dayjs from 'dayjs';
import Link from 'next/link';
import {useParams, useRouter} from 'next/navigation';

import React, {useEffect} from 'react';
import {TrashBin} from '@gravity-ui/icons';
import {CAMPAIGNS, EDIT_CAMPAIGN} from '@/shared/route';
import {useCampaignQuery} from '@/entities/campaigns/api/queryHook';
import {CampaignContextProvider} from '@/entities/campaigns/model/CampaignContext';
import {ChannelsList} from '@/widgets/campaigns/layout';
import {CampaignsTabs} from '@/widgets/campaigns/layout/ui/CampaignsTabs';
import {InfoCard} from '@/entities/campaigns/ui/InfoCard/InfoCard';
import {Permissions, useGetPermission} from '@/shared/api/permissions';

const Sources = () => {
    const {id} = useParams<{id: string}>();

    const canEdit = useGetPermission(Permissions.CAMPAIGN.EDIT);
    const canDelete = useGetPermission(Permissions.CAMPAIGN.DELETE);
    const {push} = useRouter();

    const {data, isLoading} = useCampaignQuery(id);

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
                    {href: CAMPAIGNS, text: 'Кампании'},
                    {href: '#', text: data?.name || ''},
                ]}
                actionsComponent={
                    <>
                        {canEdit && (
                            <Link href={EDIT_CAMPAIGN(data.id!)}>
                                <Button view="action">Редактировать кампанию</Button>
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
                    <CampaignContextProvider data={data}>
                        <CampaignsTabs canEdit={canEdit}>
                            <InfoCard canEdit={canEdit} />
                            <ChannelsList canEdit={canEdit} />
                        </CampaignsTabs>
                    </CampaignContextProvider>
                </EntityPage>
            </PageContentWrapper>
        </div>
    );
};

export default Sources;
