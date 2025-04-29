import {ITemplateForm} from '@/entities/templates/model/form';
import {AddLang} from '@/features/templates/add-lang/AddLang';
import {Permissions, useGetPermission} from '@/shared/api/permissions';
import {ELanguage, LANGUAGE_TEXT} from '@/shared/ui';
import {Tabs} from '@/shared/ui/Tabs/Tabs';
import {Xmark} from '@gravity-ui/icons';
import {Flex, Icon} from '@gravity-ui/uikit';
import {FC, PropsWithChildren} from 'react';
import {useForm, useFormState} from 'react-final-form';

interface IProps {
    activeTab?: ELanguage;
    setActiveTab?: (tab: ELanguage) => void;
}

export const LanguageTabs: FC<IProps & PropsWithChildren> = (props) => {
    const {children} = props;

    const canEdit = useGetPermission(Permissions.TEMPLATE.EDIT);

    const {
        values: {settings, selectLang},
    } = useFormState<ITemplateForm>();
    const formApi = useForm<ITemplateForm>();

    return (
        <Tabs
            activeTab={selectLang}
            setActiveTab={(lang) => formApi.change('selectLang', lang)}
            tabs={Object.values(settings).map(({lang}) => ({
                children,
                title: LANGUAGE_TEXT[lang],
                action:
                    lang === selectLang && canEdit
                        ? () => (
                              <>
                                  <Flex
                                      alignItems="center"
                                      justifyContent="space-between"
                                      onClick={(event) => {
                                          event.stopPropagation();
                                          const newSettings = {...settings};
                                          delete newSettings[lang];

                                          const newLang = (
                                              Object.keys(newSettings) as ELanguage[]
                                          )?.[0];

                                          formApi.change('selectLang', newLang);
                                          formApi.change('settings', newSettings);
                                      }}
                                  >
                                      <Icon data={Xmark} />
                                  </Flex>
                              </>
                          )
                        : undefined,
                value: lang,
            }))}
            actions={canEdit && <AddLang />}
        ></Tabs>
    );
};
