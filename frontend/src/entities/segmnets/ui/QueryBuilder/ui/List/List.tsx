import React, {useContext} from 'react';
import {createPortal} from 'react-dom';
import cn from 'classnames';

import {Context} from '../../context';
import {IBuilder} from '../Builder/Builder';

import styles from './List.module.scss';

export interface IListItem {
    id: string;
    label: string;
}

export interface IList {
    items?: IListItem[];
    attrRef: React.MutableRefObject<HTMLDivElement | null>;
    isLocked: boolean;
    sortField?: string;
    onDragStart?: IBuilder['onDragStart'];
    onItemClick?: IBuilder['onItemClick'];
}

export const List: React.FC<IList> = ({
    items = [],
    attrRef,
    onDragStart,
    onItemClick,
    isLocked,
}) => {
    const {getState} = useContext(Context);
    const {dragging} = getState();

    const wrappers: React.RefObject<HTMLDivElement>[] = items.map(() => React.createRef());
    const draggingField =
        dragging?.id && !isLocked && items.find((el) => el.id === dragging?.id)
            ? dragging.id
            : undefined;

    const handleDraggerMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!(event.target instanceof HTMLElement) || !event.target.dataset.draggable) {
            return;
        }

        const name = event.currentTarget.dataset.name;

        const index = items.findIndex((el) => el.id === name);
        const dom = wrappers[index].current;

        if (onDragStart && dom && name) {
            onDragStart(name, dom, event.nativeEvent);
        }
    };

    const handleItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!(event.target instanceof HTMLElement) || !event.target.dataset.draggable || isLocked) {
            return;
        }

        const name = event.target.dataset.name;

        if (onItemClick && name) {
            onItemClick(name);
        }
    };

    return (
        <div className={styles.wrapper}>
            {items.map((el) => {
                const isDraggingMe = draggingField === el.id;
                const index = items.findIndex((item) => item.id === el.id);
                const wrapper = wrappers[index];

                let stylesDrag = {};

                if (isDraggingMe && dragging) {
                    stylesDrag = {
                        top: dragging.y,
                        left: dragging.x,
                    };
                }

                return (
                    <div
                        key={el.id}
                        className={styles.field}
                        onMouseDown={handleDraggerMouseDown}
                        onClick={handleItemClick}
                        data-id={el.id}
                        data-name={el.id}
                        data-draggable
                    >
                        {isDraggingMe &&
                            attrRef?.current &&
                            createPortal(
                                <div
                                    className={cn('group-or-rule', 'qb-draggable')}
                                    style={stylesDrag}
                                >
                                    {el.label}
                                </div>,
                                attrRef.current,
                            )}
                        <div
                            className={cn('group-or-rule', {
                                [styles.disabledOption]: isLocked,
                            })}
                            style={{
                                cursor: 'pointer',
                            }}
                            ref={wrapper}
                            data-id={el.id}
                            data-name={el.id}
                            data-draggable
                        >
                            {el.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
