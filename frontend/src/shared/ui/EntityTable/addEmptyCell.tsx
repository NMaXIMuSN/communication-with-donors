import {FC, ReactNode} from 'react';
import {isEmpty} from 'lodash';

import {isExisty, isFunction} from '@/shared/lib';

import {TableRow} from './EntityTable';
import {templateMapper} from './Cells/templateMapper';
import {TableColumn} from './config/column';

export function columnWithEmptyCell<ItemType extends TableRow>(
    column: TableColumn<ItemType>,
    EmptyCell: FC,
): TableColumn<ItemType> {
    return {
        ...column,
        template(item: ItemType, index: number): ReactNode {
            if (isFunction(column.template)) {
                return column.template(item, index);
            }

            if (!isExisty(item?.[column.accessorKey]) || isEmpty(item?.[column.accessorKey])) {
                return <EmptyCell />;
            }

            return templateMapper(column)(item, index);
        },
    };
}
