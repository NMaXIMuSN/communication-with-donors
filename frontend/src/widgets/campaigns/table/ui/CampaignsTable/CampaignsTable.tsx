'use client';

import {ICampaignsFilter, ISearchCampaigns} from '@/entities/campaigns/api/fetch';
import {useSearchCampaigns} from '@/entities/campaigns/api/queryHook';
import {ISearchResponse} from '@/shared/api/type';
import {ONE_CAMPAIGN} from '@/shared/route';
import {ColumnType, DateFormat, TableColumn} from '@/shared/ui';
import {TableRow} from '@/shared/ui/EntityTable/EntityTable';
import {Flex, Label} from '@gravity-ui/uikit';
import dynamic from 'next/dynamic';
import {useCallback, useState} from 'react';

const InfiniteEntityTable = dynamic(
    () =>
        import('@/shared/ui/InfiniteEntityTable').then(
            (module) => module.InfiniteEntityTable<TableRow<ISearchCampaigns>, ICampaignsFilter>,
        ),
    {
        ssr: false,
    },
);

export const CampaignsTable = () => {
    const {mutateAsync} = useSearchCampaigns();

    const [data, setData] = useState<ISearchResponse<ISearchCampaigns>>();

    const mappersData: TableRow<ISearchCampaigns>[] = (data?.data || []).map(
        (campaign): TableRow<ISearchCampaigns> => ({
            ...campaign,
            href: ONE_CAMPAIGN(campaign.id),
        }),
    );

    const headers: TableColumn<TableRow<ISearchCampaigns>>[] = [
        {
            accessorKey: 'id',
            type: ColumnType.PLANE_TEXT,
            header: 'ID',
            maxLines: 1,
            size: 40,
        },
        {
            accessorKey: 'name',
            type: ColumnType.PLANE_TEXT,
            header: 'Название',
            maxLines: 1,
            size: 250,
        },
        {
            accessorKey: 'campaignChannels',
            type: ColumnType.CUSTOM_ACTION,
            header: 'Каналы',
            maxLines: 1,
            size: 250,
            template(item) {
                return (
                    <Flex gap={2}>
                        {item.campaignChannels.map((el) => (
                            <Label key={el.type} theme="clear">
                                {el.type}
                            </Label>
                        ))}
                    </Flex>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            type: ColumnType.DATE_TIME,
            header: 'Дата создания',
            dateFormat: DateFormat.DD_MONTH_YEAR,
            size: 250,
        },
        {
            accessorKey: 'createdById',
            type: ColumnType.USER,
            header: 'Почта Автора',
            size: 250,
        },
        {
            accessorKey: 'updatedAt',
            type: ColumnType.DATE_TIME,
            header: 'Дата изменения',
            dateFormat: DateFormat.DD_MONTH_YEAR,
            size: 250,
        },
        // {
        //     accessorKey: '',
        //     type: ColumnType.USER,
        //     header: 'Почта Последнего редактора',
        //     size: 250,
        // },
    ];

    const getListRequest = useCallback(async (_: {}, limit: number, offset: number) => {
        try {
            setData(
                await mutateAsync({
                    limit,
                    offset,
                }),
            );
        } catch (error) {
            console.error(error);
        }
    }, []);
    return (
        <InfiniteEntityTable
            filterObj={{}}
            getListRequest={getListRequest}
            data={mappersData}
            columns={headers}
        />
    );
};
