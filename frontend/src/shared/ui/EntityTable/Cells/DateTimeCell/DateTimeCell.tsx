import {useMemo} from 'react';

import {EMPTY_DASH, dateFormat} from '@/shared/ui';

import {TableColumn} from '../..';

export function toDateTimeCellTemplate<ItemType>(
    column: TableColumn<ItemType>,
): (item: ItemType, index: number) => React.ReactNode {
    return function dateTimeCellTemplate(item) {
        return (
            <DateTimeCell item={item} keyName={column.accessorKey} dateFormat={column.dateFormat} />
        );
    };
}

export type DateTimeCellProps<ItemType> = {
    item: ItemType;
    dateFormat?: string;
    keyName: keyof ItemType;
};

export function DateTimeCell<ItemType>(props: DateTimeCellProps<ItemType>) {
    const {item, keyName, dateFormat: itemDateFormat} = props;

    const formatedDate = useMemo(
        () =>
            item[keyName]
                ? dateFormat(item[keyName] as unknown as Date, itemDateFormat || 'DD MMM, HH:mm')
                : EMPTY_DASH,
        [item, keyName, itemDateFormat],
    );

    return <span>{formatedDate}</span>;
}
