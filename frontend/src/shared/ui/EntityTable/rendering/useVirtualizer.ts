import {useRowVirtualizer, useWindowRowVirtualizer} from '@gravity-ui/table';
import {Table} from '@gravity-ui/table/tanstack';

interface IProps<ItemType, ScrollElementType extends Element | Window = HTMLDivElement> {
    table: Table<ItemType>;
    overscan: number;
    estimateSize: number;
    isWindowVirtualization: boolean;
    withVirtualization?: boolean;
    containerRef: ScrollElementType;
}

// Хук для виртуализации: выбирает между виртуализацией относительно всего окна или виртуализацией только относительно контейнера
export const useVirtualizer = <
    ItemType,
    ScrollElementType extends Element | Window = HTMLDivElement,
>(
    props: IProps<ItemType, ScrollElementType>,
) => {
    const {
        table,
        isWindowVirtualization,
        withVirtualization,
        overscan,
        estimateSize,
        containerRef,
    } = props;

    const windowVirtualizer = useWindowRowVirtualizer({
        count: table.getRowModel().rows.length,
        estimateSize: () => estimateSize,
        overscan,
        enabled: withVirtualization && isWindowVirtualization,
    });

    const commonVirtualizer = useRowVirtualizer<Element>({
        count: table.getRowModel().rows.length,
        estimateSize: () => estimateSize,
        overscan,
        getScrollElement: () => containerRef as HTMLDivElement,
        enabled: withVirtualization && !isWindowVirtualization,
    });

    return isWindowVirtualization ? windowVirtualizer : commonVirtualizer;
};
