import cn from 'classnames';
import {CSSProperties} from 'react';

import {EMPTY_DASH} from '@/shared/ui';
import {OverflowTooltipText} from '@/shared/ui/OverflowTooltipText';
import {TOverflowTooltipTextProps} from '@/shared/ui/OverflowTooltipText/OverflowTooltipText';
import {CopyButton} from '@/shared/ui/CopyButton';

import entityTableStyles from '../../EntityTable.module.scss';
import {TableColumn} from '../..';
import {TableRow} from '../../EntityTable';

import styles from './PlaneTextCell.module.scss';

const DEFAULT_PLANE_TEXT_MAX_WIDTH = 200;
const COLUMN_LEFT_GAP = 20;

export function toPlanTextCellTemplate<ItemType extends TableRow>(
    column: TableColumn<ItemType>,
): (item: ItemType, index: number) => React.ReactNode {
    return function statusCellTemplate(item) {
        return (
            <PlaneTextCell
                width={Number(column.size || column.minSize || DEFAULT_PLANE_TEXT_MAX_WIDTH)}
                item={item}
                keyName={column.accessorKey}
                maxLines={column.maxLines}
                withCopyValue={column.withCopyValue}
                copyBtnPosition={column.copyBtnPosition}
                visibleBtnOnUnhover={column.visibleBtnOnUnhover}
                stylePopup={column.stylePopup}
                transformDisplayValue={column.transformDisplayValue}
            />
        );
    };
}

export type PlaneTextCellProps<ItemType> = {
    item: ItemType;
    width: number;
    maxLines: TOverflowTooltipTextProps['maxLines'];
    withCopyValue?: boolean;
    copyBtnPosition?: TableColumn<ItemType>['copyBtnPosition'];
    visibleBtnOnUnhover?: TableColumn<ItemType>['visibleBtnOnUnhover'];
    keyName?: keyof ItemType;
    stylePopup?: CSSProperties;
    transformDisplayValue?: (item: string) => string;
};

export function PlaneTextCell<ItemType extends TableRow>(props: PlaneTextCellProps<ItemType>) {
    const {
        item,
        width,
        maxLines,
        keyName,
        withCopyValue,
        copyBtnPosition,
        visibleBtnOnUnhover,
        stylePopup,
        transformDisplayValue,
    } = props;

    const text =
        keyName && item[keyName]
            ? transformDisplayValue?.(String(item[keyName])) || String(item[keyName])
            : EMPTY_DASH;

    if (withCopyValue) {
        return (
            <div className={styles.container}>
                {copyBtnPosition === 'start' && (
                    <CopyButton
                        size="s"
                        value={text}
                        className={cn(styles.copyButtonRightSpace, {
                            [entityTableStyles.showContentOnlyOnRowHover]: !visibleBtnOnUnhover,
                        })}
                    />
                )}
                <OverflowTooltipText
                    maxLines={maxLines}
                    text={text}
                    stylePopup={stylePopup}
                    link={item.href}
                />
                {(copyBtnPosition === 'end' || !copyBtnPosition) && (
                    <CopyButton
                        size="s"
                        value={text}
                        className={cn(styles.copyButtonLeftSpace, {
                            [entityTableStyles.showContentOnlyOnRowHover]: !visibleBtnOnUnhover,
                        })}
                    />
                )}
            </div>
        );
    }

    return (
        <OverflowTooltipText
            width={width - COLUMN_LEFT_GAP}
            maxLines={maxLines}
            text={text}
            stylePopup={stylePopup}
            link={item.href}
        />
    );
}
