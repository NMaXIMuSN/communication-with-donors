import {useSourcesQuery} from '@/entities/sources';
import {Source} from '@/entities/sources/api/fetchers';
import {useBooleanState} from '@/shared/lib';
import {ONE_SOURCES} from '@/shared/route';
import Card from '@/shared/ui/Card/Card';
import {ArrowUpRightFromSquare, Plus} from '@gravity-ui/icons';
import {Button, Dialog, Flex, Icon} from '@gravity-ui/uikit';
import Link from 'next/link';

interface IProps {
    onSelect: (source: Source) => void;
}

export const SourcePicker = (props: IProps) => {
    const {onSelect} = props;
    const [isOpen, onOpen, onClose] = useBooleanState(false);

    const {data} = useSourcesQuery(1, 20);

    return (
        <>
            <Button onClick={onOpen}>
                <Icon data={Plus} />
                Выбрать источник
            </Button>

            <Dialog
                size="m"
                open={isOpen}
                onClose={onClose}
                onEscapeKeyDown={onClose}
                onOutsideClick={onClose}
            >
                <Dialog.Header caption="Выбора источника" />
                <Dialog.Body>
                    <Flex direction={'column'} gap={2}>
                        {data?.data.map((source) => (
                            <Card
                                key={source.id}
                                title={source.name}
                                action={
                                    <Flex gap={2}>
                                        <Link href={ONE_SOURCES(source.systemName)} target="_blank">
                                            <Button view="action">
                                                <Icon data={ArrowUpRightFromSquare} />К источнику
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={() => {
                                                onSelect(source);
                                                onClose();
                                            }}
                                            view="action"
                                        >
                                            Выбрать
                                        </Button>
                                    </Flex>
                                }
                                subtitle={`Системное имя: {source.systemName}`}
                            />
                        ))}
                    </Flex>
                </Dialog.Body>
            </Dialog>
        </>
    );
};
