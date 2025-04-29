import {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {SortingState} from '@gravity-ui/table/tanstack';
import dynamic from 'next/dynamic';

import {isEqual} from 'lodash';
import {ColumnSortingOrder, ITableProps, TableRow} from '@/shared/ui/EntityTable';

import {usePagination} from './usePagination';
import {Loader} from '../EntityTable/Loader/Loader';
import {UseSelectionProps} from '../EntityTable/rendering/useSelection';

const EntityTable = dynamic(() => import('@/shared/ui/EntityTable/EntityTable'), {
    ssr: false,
});

type TProps<ItemType extends TableRow, FilterObjType = Record<string, unknown>> = {
    // пропсы располагаются в логическом порядке запроса данных
    filterObj: FilterObjType;
    pagination?: {
        size?: number | null;
        pages?: number | null;
    };
    limit?: number;
    getListRequest: (
        filterObj: FilterObjType,
        limit: number,
        offset: number,
        columnSortingOrder?: Record<string, ColumnSortingOrder>,
    ) => void;
    isLoading?: boolean;
    data?: ItemType[];
    error?: Record<string, unknown> | null;
    columns: ITableProps<ItemType>['columns'];
    // Если не прокидывать обработчик, то не будет подсвечиваться строка
    onRowClick?: (item: ItemType) => void;
    useList?: (newList?: ItemType[]) => [ItemType[], Dispatch<SetStateAction<ItemType[]>>];
    isDialogContainer?: boolean;
    isWindowVirtualization?: boolean;
    withSettings?: boolean;
    withRowBorder?: boolean;
    isWideRow?: boolean;
    selectedIds?: UseSelectionProps['selectedIds'];
    onSelectedChange?: UseSelectionProps['onSelectedChange'];
};

export const InfiniteEntityTable = <
    ItemType extends TableRow,
    FilterObjType = Record<string, unknown>,
>(
    props: TProps<ItemType, FilterObjType>,
) => {
    const {
        filterObj,
        pagination,
        limit = 30,
        getListRequest,
        isLoading: isLoadingP,
        data,
        error,
        useList = useState,
        columns,
        isDialogContainer,
        isWindowVirtualization = true,
        onRowClick,
        withSettings,
        withRowBorder,
        isWideRow,
        selectedIds,
        onSelectedChange,
    } = props;

    const {offset, hasMorePage, increasePage, dropState} = usePagination({
        limit,
        pagination: pagination,
    });

    // Установка дефолтного значения в реф, что бы пропустить выполнения useEffect'a сортировки
    const prevSortingState = useRef<SortingState>(
        columns.reduce<SortingState>((result, column) => {
            // Проверка на эти 2 значения, так как в колонке может быть указано значение ColumnSortingOrder.NOT_SET
            if (
                column.sortingOrder === ColumnSortingOrder.ASC ||
                column.sortingOrder === ColumnSortingOrder.DESC
            ) {
                return [
                    ...result,
                    {
                        id: column.accessorKey,
                        desc: column.sortingOrder === ColumnSortingOrder.DESC,
                    },
                ];
            }
            return result;
        }, []),
    );

    const [sortingColumnOrder, setSortingColumnOrder] = useState<SortingState>([
        ...prevSortingState.current,
    ]);
    const [list, setList] = useList<ItemType[]>([]);
    // Нужен для синхронизации стейтов между собой, тк фильтры и сортировка независимы друг от друга
    const [semaphore, setSemaphore] = useState<number>(0);
    // Стейт загрузки устанавливается при изменении тригеров запроса данных(фильтры, сортировка)
    // И завершается по условию в юзЭффекте обработки данных
    // Такое разделение нужно, тк в компоненте InfiniteEntityTable нельзя полноценно отследить загрузку данных, а помимо неё может быть ещё какая-то пост обработка в родителе
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const prevFilter = useRef<FilterObjType>({} as FilterObjType);
    const prevOffset = useRef<number>(-1);
    const prevData = useRef(data);

    // Вызывается при изменении сортировки или фильтров
    useEffect(() => {
        // Сравниваем, что значение фильтров действительно поменялось
        if (
            isEqual(prevFilter.current, filterObj) &&
            isEqual(prevSortingState.current, sortingColumnOrder)
        ) {
            return;
        }

        // Обновляем рефы в которых хранятся предыдущие значения
        prevFilter.current = filterObj;
        prevSortingState.current = sortingColumnOrder;

        // Вещаем флаг загрузки данных
        setIsLoading(true);

        // Сбрасываем стейт пагинации, так как при изменении фильтров или сортировки вновь нужно начинать просмотр данных с первой страницы
        dropState();

        // Создаем разницу между предыдущим значением и текущим в семафоре, что бы тригернуть загрузку данных
        if (prevOffset.current === 0) {
            prevOffset.current = -1;
            setSemaphore((p) => p + 1);
        }

        // Сбрасываем список
        setList([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterObj, sortingColumnOrder]);

    // Для тригера функции запроса данных
    // Должен вызываться, только при изменении офсета и семафора
    useEffect(() => {
        if (prevOffset.current === offset) {
            return;
        }

        prevOffset.current = offset;

        getListRequest(
            prevFilter.current,
            limit,
            offset,
            prevSortingState.current.reduce(
                (result, columnOrder) => ({
                    ...result,
                    [columnOrder.id]: columnOrder.desc
                        ? ColumnSortingOrder.DESC
                        : ColumnSortingOrder.ASC,
                }),
                {},
            ),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset, semaphore]);

    // Для обработки приходящих данных, тригерится только при их изменении
    useEffect(() => {
        // Если данные отсутствуют или не изменились И offset не равен 0 - пропускаем
        if (isEqual(prevData.current, data) && offset !== 0) return;

        // Обновляем данные при любом изменении offset
        prevData.current = data;

        if (data) {
            setList((currentList) => (offset === 0 ? [...data] : [...currentList, ...data]));

            if (
                prevOffset.current >=
                Number(pagination?.pages ? pagination?.pages - 1 : 0) * limit
            ) {
                setIsLoading(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        if (error) {
            setIsLoading(false);
        }
    }, [error]);

    return (
        <EntityTable
            data={list}
            isLoading={hasMorePage || isLoading || isLoadingP}
            loaderComponent={<Loader callback={increasePage} count={list.length} />}
            overscan={10}
            withVirtualization
            isWindowVirtualization={isWindowVirtualization}
            sorting={sortingColumnOrder}
            onSortingChange={setSortingColumnOrder}
            columns={columns as ITableProps<TableRow>['columns']}
            isDialogContainer={isDialogContainer}
            onRowClick={onRowClick as (item: TableRow) => void}
            withSettings={withSettings}
            withRowBorder={withRowBorder}
            isWideRow={isWideRow}
            selectedIds={selectedIds}
            onSelectedChange={onSelectedChange}
        />
    );
};
