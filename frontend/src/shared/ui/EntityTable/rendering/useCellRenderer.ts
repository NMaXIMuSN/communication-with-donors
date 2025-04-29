import React, {useMemo} from 'react';
import {ColumnDef} from '@gravity-ui/table/tanstack';

import {templateMapper} from '../Cells/templateMapper';
import {TableColumn} from '../config/column';
import {TableRow} from '..';

interface IProps<ItemType> {
    columns: TableColumn<ItemType>[];
}

interface IReturn<ItemType> {
    columns: ColumnDef<ItemType>[];
}
// Хук для мапинга функции отрисовки ячеек
// На основе поля type определяется функция и компонент, который будет отрисован внутри ячейки
export const useCellRenderer = <ItemType extends TableRow>(
    props: IProps<ItemType>,
): IReturn<ItemType> => {
    const {columns} = props;

    return useMemo(
        () => ({
            columns: columns.map((column) => {
                // TODO: убрать приведение типов после удаления дата грида
                const cell = templateMapper(column) as unknown as (
                    item: ItemType,
                ) => React.ReactNode;

                // После определения нужного шаблона для отрисовки оставляем только те поля, которые нужны в таблице, что бы не передавать лишнее
                return {
                    // без accessorKey не будет работать сортировка, по какой-то причине TanStack Table будет ставить всем колонкам canSort: false
                    accessorKey: column.accessorKey,
                    header: column.header,
                    size: column.size,
                    minSize: column.minSize,
                    maxSize: column.maxSize,
                    enableSorting: Boolean(column.sortingOrder),
                    cell: (info) => cell(info.row.original),
                };
            }),
        }),
        [columns],
    );
};
