import {ReactNode} from 'react';

import {isFunction} from '@/shared/lib';

import {toUserCellTemplate} from './UserCell/UserCell';
import {toDateTimeCellTemplate} from './DateTimeCell/DateTimeCell';
import {toPlanTextCellTemplate} from './PlaneTextCell/PlaneTextCell';
import {toNumberWithDividerCellTemplate} from './NumberWithDividerCell/NumberWithDividerCell';
import {toCustomActionTemplate} from './CustomActionCell/CustomActionCell';
import {toImageTemplate} from './ImageCell/ImageCell';
import {ColumnType, TableColumn, TableRow} from '..';

export function templateMapper<ItemType extends TableRow>(
    column: TableColumn<ItemType>,
): (item: ItemType, index: number) => ReactNode | null {
    if (isFunction(column.template)) {
        return column.template;
    }

    if (!('type' in column) || column.template !== undefined) {
        return toPlanTextCellTemplate(column);
    }

    switch (column.type) {
        case ColumnType.DATE_TIME:
            return toDateTimeCellTemplate(column);
        case ColumnType.USER:
            return toUserCellTemplate(column);
        case ColumnType.PLANE_TEXT:
            return toPlanTextCellTemplate(column);
        case ColumnType.NUMBER_WITH_DIVIDER:
            return toNumberWithDividerCellTemplate(column);
        case ColumnType.CUSTOM_ACTION:
            return toCustomActionTemplate(column);
        case ColumnType.IMAGE:
            return toImageTemplate(column);
        default:
            throw new Error('Несуществующий тип колонки');
    }
}
