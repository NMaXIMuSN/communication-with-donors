import {ETemplateType, ITemplate, WithUserInfo} from '@/entities/templates/api/fetchers';
import {useSearchTemplate} from '@/entities/templates/api/queryHook';
import {Button, Checkbox, Dialog, Flex, List, Popup, Text} from '@gravity-ui/uikit';
import {debounce} from 'lodash';
import {FC, useEffect, useRef, useState} from 'react';

import styles from './SearchTemplate.module.scss';
import {ELanguage, LANGUAGE_TEXT} from '@/shared/ui';

interface IProps {
    type: ETemplateType[];
    onSelectTemplate: (
        template: WithUserInfo<ITemplate>,
        lang: ELanguage[],
    ) => Promise<void> | void;
}

export const SearchTemplate: FC<IProps> = (props) => {
    const {type, onSelectTemplate} = props;
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const {data, mutate} = useSearchTemplate();
    const [seletedLang, setSelectedLang] = useState<Partial<Record<ELanguage, boolean>>>({});

    const [template, setTemplate] = useState<WithUserInfo<ITemplate> | undefined>();

    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const onSearch = debounce(() => {
        mutate({
            filter: {
                type,
            },
            search: search,
        });
    }, 200);

    useEffect(() => {
        onSearch();
    }, [search]);

    const onSelectTemplateHandler = async (template: WithUserInfo<ITemplate>) => {
        await onSelectTemplate(template, Object.keys(seletedLang) as ELanguage[]);
        setSelectedLang({});
        setTemplate(undefined);
    };

    return (
        <>
            <Button ref={buttonRef} onClick={() => setIsOpen((p) => !p)}>
                Добавить шаблон
            </Button>
            <Popup anchorElement={buttonRef.current} open={isOpen} onOpenChange={setIsOpen}>
                <List
                    filter={search}
                    itemsHeight={320}
                    itemHeight={() => 40}
                    onFilterUpdate={setSearch}
                    onItemClick={setTemplate}
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
                                {item.disabled && (
                                    <Text color="warning">Нет настроенных языков</Text>
                                )}
                            </Flex>
                        );
                    }}
                    className={styles.list}
                    items={data?.data.map((template) => ({
                        ...template,
                        disabled: !template.settings.length,
                    }))}
                />
            </Popup>
            <Dialog
                open={Boolean(template)}
                onClose={() => {
                    setTemplate(undefined);
                    setSelectedLang({});
                }}
            >
                <Dialog.Header caption="Выберите языки для добавления" />
                <Dialog.Body>
                    {Object.values(template?.settings || {}).map((setting) => {
                        return (
                            <Checkbox
                                key={setting.lang}
                                checked={seletedLang[setting.lang]}
                                onUpdate={(v) =>
                                    setSelectedLang((p) => ({...p, [setting.lang]: v}))
                                }
                                children={LANGUAGE_TEXT[setting.lang]}
                            />
                        );
                    })}
                </Dialog.Body>
                <Dialog.Footer
                    textButtonApply="Выбрать"
                    onClickButtonApply={() => onSelectTemplateHandler(template!)}
                />
            </Dialog>
        </>
    );
};
