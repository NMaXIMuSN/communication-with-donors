'use client';

import React, {useCallback, useRef} from 'react';
import {
    BaseTable as BaseTableGUT,
    type BaseTableProps,
    type UseTableOptions,
    useTable,
    useTableSettings,
} from '@gravity-ui/table';
import cn from 'classnames';
import {ColumnDef} from '@gravity-ui/table/tanstack';
import {Icon} from '@gravity-ui/uikit';
import {CaretDown} from '@gravity-ui/icons';

import {isFunction} from '@/shared/lib';

import {settingsColumn} from './TableSettings/TableSettings';
import {UseSelectionProps, useSelection} from './rendering/useSelection';
import {useCellRenderer} from './rendering/useCellRenderer';
import {useVirtualizer} from './rendering/useVirtualizer';
import {PredefinedColumnsIds, TableColumn} from './config/column';
import StickyScrollbar from './StikyScrollbar/StikyScrollbar';
import {TABLE_BODY_ID, TABLE_HEADER_ID, useStickyScrollbar} from './useStickyScrollbar';
import {EmptyMessage} from './EmptyMessage/EmptyMessage';
import {Loader} from './Loader/Loader';

import styles from './EntityTable.module.scss';

export type TableRow<Item = {}> = {
    id?: string | number;
    href?: string;
} & Item;

export interface ITableProps<
    ItemType extends TableRow,
    ScrollElementType extends Element | Window = HTMLDivElement,
> extends Omit<BaseTableProps<ItemType, ScrollElementType>, 'table' | 'onRowClick'>,
        Pick<
            UseTableOptions<ItemType>,
            | 'data'
            | 'getSubRows'
            | 'manualSorting'
            | 'onSortingChange'
            | 'enableGrouping'
            | 'manualGrouping'
            | 'groupedColumnMode'
            | 'onGroupingChange'
            | 'aggregationFns'
            | 'enableColumnResizing'
            | 'columnResizeMode'
            | 'columnResizeDirection'
            | 'onColumnSizingChange'
            | 'onColumnSizingInfoChange'
        >,
        Pick<UseSelectionProps, 'selectedIds' | 'onSelectedChange'>,
        Pick<NonNullable<UseTableOptions<ItemType>['state']>, 'sorting'> {
    getRowId?: UseTableOptions<ItemType>['getRowId'];
    withSettings?: boolean;
    columns: TableColumn<ItemType>[];
    onRowClick?: (item: ItemType) => void;

    withVirtualization?: boolean;
    isWideRow?: boolean;
    overscan?: number;
    isWindowVirtualization?: boolean;
    isDialogContainer?: boolean;

    loaderComponent?: React.ReactNode;
    isLoading?: boolean;

    rowClassName?: string;
    withRowBorder?: boolean;

    emptyMessageComponent?: React.ReactNode;
}

// Компонент для таблицы:
//   - добавляется стики хедер
//   - добавляется заглушка для отсутствия данных
//   - добавляется заглушка для загрузки
const EntityTable = <
    ItemType extends TableRow,
    ScrollElementType extends Element | Window = HTMLDivElement,
>(
    props: ITableProps<ItemType, ScrollElementType>,
) => {
    const {
        getRowId: getRowIdProps,
        data,

        // Выбор колонок
        columns: providedColumns,

        // Выбор строк WIP
        // https://preview.gravity-ui.com/table/?path=/story/table--with-selection
        selectedIds,
        onSelectedChange,

        // Вызывается по клику на строку в таблице
        onRowClick,

        // Добавляет колонку настроек таблицы с выбором колонок для показа и для смены сортировки колонок
        withSettings = true,

        // Виртуализация
        withVirtualization,
        // Флаг для определения высоты строки
        isWideRow = false,
        // Количество элементов, отображаемых над и под областью видимости
        overscan = 5,
        // Регулирует хуки для виртуализации
        // true - скролится объект window
        // false - скролится контейнер с ограниченной высотой
        isWindowVirtualization = false,
        // Таблица используется в модалке, добавляются классы CSS
        isDialogContainer = false,

        // Индикатор загрузки данных
        loaderComponent = <Loader />,
        isLoading,

        emptyMessageComponent = <EmptyMessage />,

        sorting,
        onSortingChange,

        rowClassName,
        withRowBorder = false,

        ...tableProps
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);

    const {enableRowSelection, enableMultiRowSelection, rowSelection, handleRowSelectionChange} =
        useSelection<ItemType>({
            selectedIds,
            onSelectedChange,
        });
    const {columns} = useCellRenderer({columns: providedColumns});
    const {state, callbacks} = useTableSettings({
        initialVisibility: providedColumns.reduce(
            (initialVisibility, column) => ({
                ...initialVisibility,
                [column.accessorKey]: column.isSelected ?? true,
            }),
            {},
        ),
    });

    const getRowId = useCallback(
        (item: ItemType, index: number) => {
            if (getRowIdProps && isFunction(getRowIdProps)) {
                return getRowIdProps(item, index);
            }

            return String(item.id) || String(index);
        },
        [getRowIdProps],
    );

    const table = useTable({
        getRowId,
        data,
        columns: [...columns, ...(withSettings ? [settingsColumn as ColumnDef<ItemType>] : [])],
        state: {
            rowSelection,
            sorting,
            columnPinning: {
                right: [PredefinedColumnsIds.SETTINGS],
            },
            ...state,
        },

        enableRowSelection,
        enableMultiRowSelection,
        onRowSelectionChange: handleRowSelectionChange,

        enableSorting: Boolean(onSortingChange),
        // Если будет false TanStack Table будет самостоятельно менять порядок элементов
        // можно отключить, если требуется сортировка данных только на фронте
        manualSorting: true,
        onSortingChange,
        ...callbacks,
    });

    const rowVirtualizer = useVirtualizer<ItemType, HTMLDivElement | Window>({
        table,
        estimateSize: isWideRow ? 60 : 40,
        overscan,
        containerRef: containerRef.current as HTMLDivElement,
        withVirtualization,
        isWindowVirtualization,
    });

    const {tableScrollWidth, containerWidth, onHorizontalScrollChanged, horizontalScrollBar} =
        useStickyScrollbar(containerRef);

    return (
        <div
            ref={containerRef}
            className={cn(styles.container, {
                [styles.isDialogContainer]: isDialogContainer,
            })}
        >
            <BaseTableGUT
                table={table}
                headerAttributes={{
                    id: TABLE_HEADER_ID,
                }}
                bodyAttributes={{
                    id: TABLE_BODY_ID,
                }}
                // ошибка не соответствия ScrollElementType для виртуализации window и элемента
                // @ts-expect-error
                rowVirtualizer={rowVirtualizer}
                renderSortIndicator={({header}) => {
                    const order = header.column.getIsSorted();

                    return (
                        <div className={styles.sortingIcon}>
                            <Icon
                                size={16}
                                data={CaretDown}
                                className={cn({
                                    [styles.caretUp]: order === 'asc',
                                    [styles.unset]: !order,
                                })}
                            />
                        </div>
                    );
                }}
                onRowClick={
                    onRowClick
                        ? (row, event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
                              // Если сработало на ссылке, то не вызываем onRowClick
                              // @ts-ignore почему-то react не знает про поля в target
                              if (event.target.tagName !== 'A') {
                                  onRowClick(row.original);
                              }
                          }
                        : undefined
                }
                stickyHeader
                className={cn(styles.table)}
                bodyClassName={cn(styles.tableBody)}
                headerRowClassName={cn(styles.rowStartPadding, styles.headerRow)}
                rowClassName={cn(styles.rowStartPadding, styles.row, rowClassName, {
                    [styles.hover]: Boolean(onRowClick),
                    [styles.rowBorder]: withRowBorder,
                })}
                headerCellClassName={cn(styles.cell, styles.headerCell, {
                    [styles.headerCellSettings]: withSettings,
                })}
                cellClassName={cn(styles.cell, {
                    [styles.wideCell]: isWideRow,
                })}
                {...tableProps}
            />
            {/* TODO: рассмотреть renderCustomRowContent */}
            {isLoading && loaderComponent}
            {!isLoading && !data.length && emptyMessageComponent}
            <StickyScrollbar
                scrollBarRef={horizontalScrollBar}
                width={Math.min(containerWidth, tableScrollWidth)}
                scrollWidth={tableScrollWidth}
                scrollbarWidth={containerWidth}
                onScrollChanged={onHorizontalScrollChanged}
            />
        </div>
    );
};

export default EntityTable;
