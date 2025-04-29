import {useCallback, useMemo} from 'react';
import type {UseTableOptions} from '@gravity-ui/table';

export type UseSelectionProps = {
    selectedIds?: string[];
    onSelectedChange?: (selectedIds: string[]) => void;
};
// Хук для выбора строчек с через чекбокс
export function useSelection<ItemType>({selectedIds, onSelectedChange}: UseSelectionProps) {
    const rowSelection = useMemo(() => {
        const result: Record<string, boolean> = {};

        for (const id of selectedIds ?? []) {
            result[id] = true;
        }

        return result;
    }, [selectedIds]);

    const handleRowSelectionChange = useCallback<
        NonNullable<UseTableOptions<ItemType>['onRowSelectionChange']>
    >(
        (getNewRowSelection) => {
            type RowSelectionState = NonNullable<
                NonNullable<UseTableOptions<ItemType>['state']>['rowSelection']
            >;

            const newRowSelection = (
                getNewRowSelection as (oldSelection: RowSelectionState) => RowSelectionState
            )(rowSelection);

            onSelectedChange?.(Object.keys(newRowSelection).filter((key) => newRowSelection[key]));
        },
        [onSelectedChange, rowSelection],
    );

    return {
        enableRowSelection: Boolean(onSelectedChange),
        enableMultiRowSelection: Boolean(onSelectedChange),
        rowSelection,
        handleRowSelectionChange,
    };
}
