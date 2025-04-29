import {useCallback} from 'react';

import {TableColumn} from '../..';

export function toCustomActionTemplate<ItemType>(
    column: TableColumn<ItemType>,
): (item: ItemType, index: number) => React.ReactNode {
    return function statusCellTemplate(item) {
        return <CustomActionCell item={item} keyName={column.accessorKey as keyof ItemType} />;
    };
}

export type CustomActionCellProps<ItemType> = {
    item: ItemType;
    keyName: keyof ItemType;
};

export function CustomActionCell<ItemType>(props: CustomActionCellProps<ItemType>) {
    const {item, keyName} = props;

    const onClickHandler = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    }, []);

    return (
        <div style={{maxWidth: '100%'}} onClick={onClickHandler}>
            {item[keyName] as React.ReactNode}
        </div>
    );
}
