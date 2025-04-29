import {useCallback, useRef, useState} from 'react';
import type {ColumnDef, Row, Table} from '@gravity-ui/table/tanstack';
import {
    BaseTable,
    ReorderingProvider,
    ReorderingProviderProps,
    dragHandleColumn,
    useTable,
} from '@gravity-ui/table';
import {Check, Gear} from '@gravity-ui/icons';
import {Button, Icon, Popup} from '@gravity-ui/uikit';
import cn from 'classnames';
import {clone} from 'lodash';

import {useBooleanState} from '@/shared/lib';

import {PredefinedColumnsIds} from '..';

import styles from './TableSettings.module.scss';

const SELECT_COLUMN_ID = 'select';

// Применяется в массиве columns
export const settingsColumn: ColumnDef<unknown> = {
    // Нужно задавать именно через id, а не accessorKey
    id: PredefinedColumnsIds.SETTINGS,
    header: SettingsColumnButton,
    size: 44,
};

type TColumnItem = {id: string; name: string};

export type Props<TData> = {
    table: Table<TData>;
};
// Компонент для управления отображением колонок в таблице
// состояние таблицы меняется через стейты и колбэки useTableSettings(@garvity-ui/table),
// которые устанавливаются в опции внешней таблицы(outterTable) при инициализации с помощью хука useTable

// Используется свой компонент настроек, так как библиотека не дает возможности кастомизации TableSettings
export function SettingsColumnButton<TData>(props: Props<TData>) {
    const {table: outterTable} = props;

    const anchorRef = useRef<HTMLDivElement | null>(null);

    const [open, , onClose, toggle] = useBooleanState(false);
    const [data, setData] = useState<TColumnItem[]>(() => {
        // Достаем колонки из API таблицы
        // и удаляем технические колонки, которые не должны попасть в список
        const columns = outterTable
            .getAllColumns()
            .filter(
                (otherColumn) =>
                    !(Object.values(PredefinedColumnsIds) as string[]).includes(otherColumn.id),
            );
        // Достаем порядок колонки из API таблицы
        const columnsOrder = outterTable.getState().columnOrder;

        // При первом открытии настроек, порядок ещё не настраивался и пуст
        if (!columnsOrder.length) {
            // используем изначальную сортировку
            return columns.map((column) => ({
                id: column.id,
                name: column.columnDef.header as string,
            }));
        }

        // Мапим колонки с с айдишниками попорядку, что бы получить и имя и идентификатор
        return columnsOrder.reduce((result, orderedColumnId) => {
            const fullColumn = columns.find((column) => column.id === orderedColumnId);

            if (fullColumn) {
                return [
                    ...result,
                    {
                        id: fullColumn.id,
                        name: fullColumn.columnDef.header as string,
                    },
                ];
            }
            return result;
        }, [] as TColumnItem[]);
    });
    // Храним в промежуточном стейте, так как настройки применяются только при сабмите формы
    const [visibilityState, setVisibilityState] = useState(
        () => outterTable.getState().columnVisibility,
    );

    const onSubmit = () => {
        outterTable.setColumnVisibility(visibilityState);
        outterTable.setColumnOrder(data.map((column) => column.id));

        onClose();
    };

    const onReorderHandler = useCallback<
        NonNullable<ReorderingProviderProps<TColumnItem>['onReorder']>
    >(({draggedItemKey, baseItemKey}) => {
        setData((prevData) => {
            const dataClone = clone(prevData);

            const index = dataClone.findIndex((item) => item.id === draggedItemKey);

            if (index >= 0) {
                const dragged = dataClone.splice(index, 1)[0] as TColumnItem;
                const insertIndex = dataClone.findIndex((item) => item.id === baseItemKey);

                if (insertIndex >= 0) {
                    dataClone.splice(insertIndex + 1, 0, dragged);
                } else {
                    dataClone.unshift(dragged);
                }
            }

            return dataClone;
        });
    }, []);

    const selectionCell: Extract<
        NonNullable<ColumnDef<TColumnItem>['cell']>,
        Function
    > = useCallback(
        (info) => {
            const isVisible = visibilityState[info.row.id] ?? true;

            return (
                <div className={cn(styles.cell, styles.checkCell)}>
                    {isVisible && <Icon data={Check} size={16} />}
                </div>
            );
        },
        [visibilityState],
    );

    const onRowClick = useCallback(
        (row: Row<TColumnItem>) => {
            const isVisible = visibilityState[row.id] ?? true;

            setVisibilityState((prevState) => ({
                ...prevState,
                [row.id]: !isVisible,
            }));
        },
        [visibilityState],
    );

    const innerTable = useTable({
        columns: [
            dragHandleColumn,
            {
                id: 'name',
                accessorKey: 'name',
                size: 240,
            },
            {
                id: SELECT_COLUMN_ID,
                cell: selectionCell,
                size: 40,
            },
        ] as ColumnDef<TColumnItem, unknown>[],
        data,
        // Нужно прописать явно, так как если не передать функции, то по дефолту айдишником будет считаться индекс
        // и сортировка работать не будет
        getRowId: (row) => row.id,
    });

    return (
        <>
            <Button view="flat-secondary" ref={anchorRef} component={'div'} onClick={toggle}>
                <Icon data={Gear} size={20} />
            </Button>
            <Popup
                anchorRef={anchorRef}
                open={open}
                placement="bottom-end"
                onEscapeKeyDown={onClose}
                onOutsideClick={onClose}
                onClose={onClose}
                style={{
                    bottom: 'unset',
                    left: 'unset',
                    top: 0,
                    right: 0,
                    zIndex: 1000,
                }}
            >
                <ReorderingProvider table={innerTable} onReorder={onReorderHandler}>
                    <BaseTable
                        table={innerTable}
                        rowClassName={styles.row}
                        cellClassName={(cell) =>
                            // условие нужно для увеличения области клика по колонке настроек видимости колонки
                            cell?.column?.id !== SELECT_COLUMN_ID ? styles.cell : ''
                        }
                        onRowClick={onRowClick}
                        withHeader={false}
                    />
                </ReorderingProvider>
                <div className={styles.action}>
                    <Button width="max" size="l" view="action" onClick={onSubmit}>
                        Применить
                    </Button>
                </div>
            </Popup>
        </>
    );
}
