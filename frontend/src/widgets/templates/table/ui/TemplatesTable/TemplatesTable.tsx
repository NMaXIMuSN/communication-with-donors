import {ITemplate, WithUserInfo} from '@/entities/templates/api/fetchers';
import {useSearchTemplate} from '@/entities/templates/api/queryHook';
import {TEMPLATE_TYPE_TEXT} from '@/entities/templates/ui/translations';
import {ISearchResponse} from '@/shared/api/type';
import {ONE_TEMPLATE} from '@/shared/route';
import {ColumnType, DateFormat, TableColumn} from '@/shared/ui';
import {TableRow} from '@/shared/ui/EntityTable/EntityTable';
import {Label} from '@gravity-ui/uikit';
import dynamic from 'next/dynamic';
import {useCallback, useState} from 'react';

const InfiniteEntityTable = dynamic(
    () =>
        import('@/shared/ui/InfiniteEntityTable').then(
            (module) => module.InfiniteEntityTable<TableRow<WithUserInfo<ITemplate>>>,
        ),
    {
        ssr: false,
    },
);

export const TemplatesTable = () => {
    const {mutateAsync} = useSearchTemplate();

    const [data, setData] = useState<ISearchResponse<WithUserInfo<ITemplate>>>();

    const mappersData: TableRow<WithUserInfo<ITemplate>>[] = (data?.data || []).map(
        (template): TableRow<WithUserInfo<ITemplate>> => ({
            ...template,
            href: ONE_TEMPLATE(template.id!),
        }),
    );

    const headers: TableColumn<TableRow<WithUserInfo<ITemplate>>>[] = [
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
            accessorKey: 'type',
            type: ColumnType.CUSTOM_ACTION,
            header: 'Тип',
            maxLines: 1,
            size: 250,
            template(item) {
                return <Label theme="clear">{TEMPLATE_TYPE_TEXT[item.type]}</Label>;
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

    const getListRequest = useCallback(
        async (_: {}, limit: number, offset: number) => {
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
        },
        [mutateAsync],
    );
    return (
        <InfiniteEntityTable
            filterObj={{}}
            getListRequest={getListRequest}
            data={mappersData}
            columns={headers}
        />
    );
};
