import {Button, Flex, List, Popup, Text} from '@gravity-ui/uikit';
import {debounce} from 'lodash';
import {FC, useEffect, useRef, useState} from 'react';

import styles from './SearchSegment.module.scss';
import {useSearchSegment} from '@/entities/segmnets/api/queryHook';
import {ISegment} from '@/entities/segmnets/api/fetchers';

interface IProps {
    text: string;
    disabled?: boolean;
    onSelectSegment: (segment: ISegment) => Promise<void> | void;
}

export const SearchSegment: FC<IProps> = (props) => {
    const {text, disabled, onSelectSegment} = props;
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const {data, mutate} = useSearchSegment();

    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const onSearch = debounce(() => {
        mutate({
            search: search,
        });
    }, 200);

    useEffect(() => {
        onSearch();
    }, [search]);

    return (
        <>
            <Button ref={buttonRef} onClick={() => setIsOpen((p) => !p)} disabled={disabled}>
                {text}
            </Button>
            <Popup anchorElement={buttonRef.current} open={isOpen} onOpenChange={setIsOpen}>
                <List
                    filter={search}
                    itemsHeight={320}
                    itemHeight={() => 30}
                    onFilterUpdate={setSearch}
                    onItemClick={onSelectSegment}
                    renderItem={(item) => {
                        return (
                            <Flex
                                justifyContent={'center'}
                                direction={'column'}
                                className={styles.listItem}
                            >
                                <Text as="div" color={item.disabled ? 'secondary' : 'primary'}>
                                    {item.name}
                                </Text>
                            </Flex>
                        );
                    }}
                    className={styles.list}
                    items={data?.data}
                />
            </Popup>
        </>
    );
};
