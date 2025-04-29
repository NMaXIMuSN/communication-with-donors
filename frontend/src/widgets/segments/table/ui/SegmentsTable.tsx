import {ISegmentWithUserInfo} from '@/entities/segmnets/api/fetchers';
import {useSearchSegment} from '@/entities/segmnets/api/queryHook';
import {ISearchResponse} from '@/shared/api/type';
import {ONE_SEGMENT} from '@/shared/route';
import {ColumnType, DateFormat, TableColumn} from '@/shared/ui';
import {TableRow} from '@/shared/ui/EntityTable/EntityTable';
import {Text} from '@gravity-ui/uikit';
import dynamic from 'next/dynamic';
import {useCallback, useState} from 'react';

const InfiniteEntityTable = dynamic(
    () =>
        import('@/shared/ui/InfiniteEntityTable').then(
            (module) => module.InfiniteEntityTable<TableRow<ISegmentWithUserInfo>>,
        ),
    {
        ssr: false,
    },
);

export const SegmentsTable = () => {
    const {mutateAsync} = useSearchSegment();

    const [data, setData] = useState<ISearchResponse<ISegmentWithUserInfo>>();

    const mappersData: TableRow<ISegmentWithUserInfo>[] = (data?.data || []).map(
        (segment): TableRow<ISegmentWithUserInfo> => ({
            ...segment,
            href: ONE_SEGMENT(segment.id!),
        }),
    );

    const headers: TableColumn<TableRow<ISegmentWithUserInfo>>[] = [
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
            accessorKey: 'source',
            type: ColumnType.CUSTOM_ACTION,
            header: 'Источники',
            maxLines: 1,
            size: 250,
            template(item) {
                return <Text>{item.source?.map(({name}) => name).join(', ')}</Text>;
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
        {
            accessorKey: 'updatedById',
            type: ColumnType.USER,
            header: 'Почта Последнего редактора',
            size: 250,
        },
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
