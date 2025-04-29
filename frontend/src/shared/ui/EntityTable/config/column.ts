import {CSSProperties} from 'react';
import {LabelProps} from '@gravity-ui/uikit';
import {ColumnDef} from '@gravity-ui/table/tanstack';

import {TOverflowTooltipTextProps} from '@/shared/ui/OverflowTooltipText/OverflowTooltipText';

export enum PredefinedColumnsIds {
    SETTINGS = 'settings',
}

export enum ColumnType {
    STATUS = 'status',
    STATUS_FILLED_IN = 'status_filled_in',
    TAGS = 'tags',
    TAGS_BACKGROUNDLESS = 'tags_backgroundless',
    USER = 'user',
    DATE_TIME = 'datetime',
    PLANE_TEXT = 'plane_text',
    NUMBER_WITH_DIVIDER = 'number_with_divider',
    SETTINGS = PredefinedColumnsIds.SETTINGS,
    CUSTOM_ACTION = 'custom_action',
    IMAGE = 'image',
    YSERVICES_LIST = 'yservices_list',

    EMPTY = 'empty',
}

export const EMPTY_COLUMN_TYPES_ARR = [ColumnType.EMPTY, ColumnType.SETTINGS];

export enum ColumnSortingOrder {
    ASC = 'ASC',
    DESC = 'DESC',
    NOT_SET = 'NOT_SET',
}

export type TableColumn<ItemType> = ColumnDef<ItemType> & {
    accessorKey: string & keyof ItemType; // вместо id (который нужен для accessorFn)

    // Остальные опциональны:
    type?: ColumnType;
    statusLabel?: Record<string, string>;
    statusThemeMap?: Record<string, LabelProps['theme']>;
    statusSize?: LabelProps['size'];
    maxLines?: TOverflowTooltipTextProps['maxLines'];
    isSelected?: boolean;
    showContentOnlyOnRowHover?: boolean;
    dateFormat?: string;
    alignContent?: 'flex-start' | 'center' | 'flex-end';
    copyBtnPosition?: 'start' | 'end';
    withCopyValue?: boolean;
    visibleBtnOnUnhover?: boolean;
    stylePopup?: CSSProperties;
    sortingOrder?: ColumnSortingOrder; // Для колонок, которые не доступны для сортировок оставляем незаполенное значение (undefined)
    customBtn?: JSX.Element;
    template?: (item: ItemType, index: number) => React.ReactNode;
    getTagsVisibleCount?: (item: ItemType) => number;
    transformDisplayValue?: (item: string) => string;
};
