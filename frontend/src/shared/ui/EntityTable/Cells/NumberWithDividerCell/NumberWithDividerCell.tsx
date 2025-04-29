import {Text} from '@gravity-ui/uikit';

import {divideThousandsWith} from '@/shared/ui/formatters';

import {TableColumn} from '../..';

export function toNumberWithDividerCellTemplate<ItemType>(
    column: TableColumn<ItemType>,
): (item: ItemType, index: number) => React.ReactNode {
    return function statusCellTemplate(item) {
        return <NumberWithDividerCell item={item} keyName={column.accessorKey} />;
    };
}

export type NumberWithDividerCellProps<ItemType> = {
    item: ItemType;
    keyName?: keyof ItemType;
};

export function NumberWithDividerCell<ItemType>(props: NumberWithDividerCellProps<ItemType>) {
    const {item, keyName} = props;

    return (
        <Text title={keyName ? String(item[keyName]) : ''}>
            {keyName && !isNaN(Number(item[keyName]))
                ? divideThousandsWith({number: Number(item[keyName])})
                : ''}
        </Text>
    );
}
