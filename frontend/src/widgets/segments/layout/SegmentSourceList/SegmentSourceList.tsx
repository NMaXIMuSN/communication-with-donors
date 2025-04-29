import {QueryBuilder} from '@/entities/segmnets/ui/QueryBuilder';
import styles from './SegmentSourceList.module.scss';
import {FC, useContext, useState} from 'react';
import {Context} from '@/entities/segmnets/ui/QueryBuilder/context';
import {SourceList} from './SourceList';
import {Source} from '@/entities/sources/api/fetchers';
import {IBuilder} from '@/entities/segmnets/ui/QueryBuilder/ui';

interface IProps {
    onDeleteSourceClick?: (name: string) => void;
    sortField?: string;
    sources?: Source[];
    listButton?: React.ReactNode;

    attrRef: React.MutableRefObject<HTMLDivElement | null>;
    isLocked: boolean;
    onDragStart?: IBuilder['onDragStart'];
    onItemClick?: IBuilder['onItemClick'];
}

export const SegmentSourceList: FC<IProps> = (props) => {
    const {
        sources,
        attrRef,
        onDragStart,
        onItemClick,
        onDeleteSourceClick,
        sortField,
        listButton,
        isLocked,
    } = props;
    const [search, setSearch] = useState('');

    const {getState} = useContext(Context);

    const {dragging} = getState();

    return (
        <div className={styles.wrapper}>
            <div className={styles.controls}>
                <QueryBuilder.ListSearch
                    value={search}
                    onChange={(value: string) => setSearch(value)}
                    controls={listButton}
                    placeholder="Поиск по названию..."
                />
            </div>
            <SourceList
                sources={sources}
                search={search}
                attrRef={attrRef}
                isLocked={isLocked}
                dragging={dragging}
                sortField={sortField}
                onDragStart={onDragStart}
                onItemClick={onItemClick}
                onDeleteSourceClick={onDeleteSourceClick}
            />
        </div>
    );
};
