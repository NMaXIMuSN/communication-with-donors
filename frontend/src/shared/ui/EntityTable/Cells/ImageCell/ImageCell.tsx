import Image from 'next/image';

import {TableColumn} from '../..';

export function toImageTemplate<ItemType>(
    column: TableColumn<ItemType>,
): (item: ItemType, index: number) => React.ReactNode {
    return function statusCellTemplate(item) {
        return <ImageCell item={item} height={36} keyName={column.accessorKey} />;
    };
}

export interface IProps<ItemType> {
    item: ItemType;
    height: number;
    keyName?: keyof ItemType;
}

export function ImageCell<ItemType>(props: IProps<ItemType>) {
    const {item, keyName, height} = props;

    return (
        <div style={{position: 'relative', width: '100%', height}}>
            <Image
                src={keyName && item[keyName] ? String(item[keyName]) : ''}
                fill
                style={{objectFit: 'contain'}}
                alt=""
            />
        </div>
    );
}
