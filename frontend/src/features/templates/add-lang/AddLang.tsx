import {ELanguage, LANGUAGE_TEXT} from '@/shared/ui';
import {ChevronDown} from '@gravity-ui/icons';
import {Button, Icon, Popup, PopupAnchorElement} from '@gravity-ui/uikit';
import {useState} from 'react';
import styles from './AddLang.module.scss';
import {useForm, useFormState} from 'react-final-form';
import {DEFAULT_SETTING, ITemplateForm} from '@/entities/templates/model/form';
import cn from 'classnames';
import {Permissions, useGetPermission} from '@/shared/api/permissions';

export const AddLang = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [buttonElement, setButtonElement] = useState<PopupAnchorElement | null>(null);
    const canEdit = useGetPermission(Permissions.TEMPLATE.EDIT);

    const formApi = useForm<ITemplateForm>();
    const formState = useFormState<ITemplateForm>();

    const addLang = (lang: ELanguage) => {
        formApi.change('settings', {
            ...formState.values.settings,
            [lang]: {
                ...DEFAULT_SETTING,
                lang,
            },
        });
        formApi.change('selectLang', lang);

        setIsOpen((p) => !p);
    };

    return (
        <>
            <Button
                view="action"
                ref={setButtonElement}
                onClick={() => setIsOpen((p) => !p)}
                disabled={!canEdit}
            >
                Добавить язык <Icon data={ChevronDown} />
            </Button>
            <Popup
                anchorElement={buttonElement}
                open={isOpen}
                placement={['bottom', 'top']}
                className={styles.list}
                onOpenChange={(open) => setIsOpen(open)}
            >
                <div className={styles.listWrapper}>
                    {Object.values(ELanguage).map((lang) => {
                        const disabled = Boolean(formState.values?.settings?.[lang]);
                        return (
                            <div
                                key={lang}
                                className={cn(styles.listItem, {
                                    [styles.listItemDisabled]: disabled,
                                })}
                                onClick={() => addLang(lang as ELanguage)}
                            >
                                {LANGUAGE_TEXT[lang as ELanguage]}
                            </div>
                        );
                    })}
                </div>
            </Popup>
        </>
    );
};
