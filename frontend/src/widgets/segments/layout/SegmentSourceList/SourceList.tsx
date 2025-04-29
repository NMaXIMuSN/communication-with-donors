import React, {useMemo} from 'react';
import {Button, Flex, Icon, Text} from '@gravity-ui/uikit';
import {createPortal} from 'react-dom';
import cn from 'classnames';
import {useCollapse} from 'react-collapsed';

import {IBuilder} from '@/entities/segmnets/ui/QueryBuilder/ui';

import styles from './SourceList.module.scss';
import {IDrag, IGroupedField, getFieldsByGroup} from '@/entities/segmnets/ui/QueryBuilder';
import {Source} from '@/entities/sources/api/fetchers';
import {TrashBin} from '@gravity-ui/icons';

interface ISourceList {
    sources?: Source[];
    search?: string;
    sortField?: string;
    attrRef: React.MutableRefObject<HTMLDivElement | null>;
    dragging?: IDrag;
    isLocked: boolean;
    onDragStart?: IBuilder['onDragStart'];
    onItemClick?: IBuilder['onItemClick'];
    onDeleteSourceClick?: (name: string) => void;
}

export const SourceList: React.FC<ISourceList> = ({
    sources = [],
    sortField,
    search,
    dragging,
    attrRef,
    isLocked,
    onDeleteSourceClick,
    onDragStart,
    onItemClick,
}) => {
    const fieldsIds = sources.reduce((arr: string[], curr) => {
        const currNames = curr?.attributes
            ?.map((el) => {
                if (el.systemName && curr.systemName) {
                    return `${curr.systemName}-${el.systemName}`;
                }
                return '';
            })
            .filter((el) => el) as string[];

        if (curr.id) {
            return [...arr, ...currNames];
        }
        return arr;
    }, []);
    const {getCollapseProps, getToggleProps} = useCollapse({
        defaultExpanded: true,
    });

    const wrappers: React.RefObject<HTMLDivElement>[] = fieldsIds.map(() => React.createRef());
    const fieldsByGroup = getFieldsByGroup(sources);

    const searchSources = useMemo(() => {
        if (!search) return fieldsByGroup;

        return fieldsByGroup
            .map((group) => {
                const filteredFields = group.fields.filter((field) => {
                    const searchLowerCase = search.toLowerCase();

                    if (field.label) {
                        return field.label.toLowerCase().includes(searchLowerCase);
                    }

                    return field.name.toLowerCase().includes(searchLowerCase);
                });

                if (!filteredFields.length) return undefined;

                return {...group, fields: filteredFields};
            })
            .filter((group) => Boolean(group)) as IGroupedField[];
    }, [fieldsByGroup, search]);

    const draggingField =
        dragging?.id && !isLocked && fieldsIds.find((el) => el === dragging?.id)
            ? dragging.id
            : undefined;

    const handleDraggerMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!(event.target instanceof HTMLElement) || !event.target.dataset.draggable) {
            return;
        }

        const name = event.currentTarget.dataset.name;

        const index = fieldsIds.findIndex((el) => el === name);
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
            <Text>Источники</Text>
            <div className={styles.items}>
                {searchSources?.map((group) => {
                    if (!group.fields) return null;

                    // const menuItems = getMenuItemsForGroup(group);

                    return (
                        <div className={styles.item} key={group.id}>
                            <div>
                                <div {...getToggleProps()} style={{width: '100%'}}>
                                    <Flex alignItems={'center'} justifyContent={'space-between'}>
                                        <Text variant="body-1" color="secondary">
                                            {group.label}
                                        </Text>
                                        {!isLocked && (
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteSourceClick?.(group.id);
                                                }}
                                            >
                                                <Icon data={TrashBin} />
                                            </Button>
                                        )}
                                    </Flex>
                                </div>
                                <div className={styles.group} {...getCollapseProps()}>
                                    {group?.fields?.map((el) => {
                                        const isDraggingMe = draggingField === el.id;
                                        const index = fieldsIds.findIndex((item) => item === el.id);
                                        const wrapper = wrappers[index];

                                        let stylesDrag = {};
                                        if (isDraggingMe && dragging) {
                                            stylesDrag = {
                                                top: dragging.y,
                                                left: dragging.x,
                                            };
                                        }

                                        const isSortField =
                                            sortField === `${group.label}.${el.name}`;

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
                                                            className={cn(
                                                                'group-or-rule',
                                                                'qb-draggable',
                                                            )}
                                                            style={stylesDrag}
                                                        >
                                                            {el.label || el.name}
                                                        </div>,
                                                        attrRef.current,
                                                    )}
                                                <div
                                                    className={cn('group-or-rule', {
                                                        [styles.disabledOption]: isLocked,
                                                        [styles.groupItemWithIcon]: isSortField,
                                                    })}
                                                    // style={{
                                                    //     cursor: 'pointer',
                                                    // }}
                                                    ref={wrapper}
                                                    data-id={el.id}
                                                    data-name={el.id}
                                                    data-draggable
                                                >
                                                    {el.label || el.name}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
