import React, {PureComponent, RefObject} from 'react';
import cn from 'classnames';

import {_isReorderingTree} from '../SortableContainer/SortableContainer';
import {IDrag} from '../../types';

export interface IDraggable {
    id?: string;
    onDragStart: Function;
    isDraggingTempo: boolean;
    isDraggingMe: boolean;
    dragging: IDrag;
    isTrueLocked: boolean;
}

interface IDraggableComponent {
    isDraggingTempo?: boolean;
    isDraggingMe?: boolean;
    handleDraggerMouseDown?: Function;
}

export const Draggable =
    (className: string) =>
    <T extends IDraggable>(GroupOrRule: React.ComponentType<IDraggableComponent>) =>
        class Draggable extends PureComponent<T> {
            wrapper: RefObject<HTMLDivElement>;

            constructor(props: T) {
                super(props);
                this.wrapper = React.createRef();
            }

            handleDraggerMouseDown = (e: MouseEvent) => {
                const {id, onDragStart} = this.props;
                const dom = this.wrapper.current;

                if (onDragStart) {
                    onDragStart(id, dom, e);
                }
            };

            render() {
                const {isDraggingTempo, isDraggingMe, dragging, ...otherProps} = this.props;
                const {isTrueLocked} = otherProps;

                let styles = {};
                if (isDraggingMe && isDraggingTempo) {
                    if (_isReorderingTree) {
                        // don't apply old styles for dragging tempo during reorder
                    } else {
                        styles = {
                            top: dragging.y,
                            left: dragging.x,
                            width: dragging.w,
                        };
                    }
                }

                const classNames = cn(
                    className,
                    'group-or-rule',
                    isDraggingMe && isDraggingTempo ? 'qb-draggable' : null,
                    isTrueLocked ? 'locked' : null,
                );

                return (
                    <div
                        className={classNames}
                        style={styles}
                        ref={this.wrapper}
                        data-id={this.props.id}
                        data-name={this.props.id}
                    >
                        <GroupOrRule
                            handleDraggerMouseDown={this.handleDraggerMouseDown}
                            isDraggingMe={isDraggingMe}
                            isDraggingTempo={isDraggingTempo}
                            {...otherProps}
                        />
                    </div>
                );
            }
        };
