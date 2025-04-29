import {useSourcesQuery} from '@/entities/sources';
import {Source} from '@/entities/sources/api/fetchers';
import {ColumnType, DateFormat, TableColumn} from '@/shared/ui';
import EntityTable, {TableRow} from '@/shared/ui/EntityTable/EntityTable';

export const SourcesTable = () => {
    const {data} = useSourcesQuery(1, 20);

    const mapersData: TableRow<Source>[] = (data?.data || []).map(
        (source): TableRow<Source> => ({
            ...source,
            href: '/sources/' + source.systemName,
        }),
    );

    const headers: TableColumn<TableRow<Source>>[] = [
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
            accessorKey: 'systemName',
            type: ColumnType.PLANE_TEXT,
            header: 'Системное название',
            maxLines: 1,
            size: 250,
        },
        {
            accessorKey: 'tableName',
            type: ColumnType.PLANE_TEXT,
            header: 'Таблица',
            maxLines: 1,
            size: 250,
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
    ];
    return <EntityTable data={mapersData} columns={headers} />;
};
