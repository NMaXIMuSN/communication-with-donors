import {FC, PropsWithChildren, createContext, useMemo} from 'react';
import {ISetting, ITemplate, ITemplateSelect, WithUserInfo} from '../api/fetchers';
import {ELanguage} from '@/shared/ui';
import {useUpdateTemplateMutation} from '../api/queryHook';
import {toaster} from '@/shared/toaster/notification';

interface IState {
    template: WithUserInfo<ITemplateSelect>;
    lang?: ISetting;
}

interface IActions {
    onUpdate: (template: ITemplateSelect) => Promise<WithUserInfo<ITemplate> | undefined>;
}

interface IContextValue {
    state: IState;
    actions: IActions;
}

export const TemplateContext = createContext<IContextValue>({} as IContextValue);

interface IProps {
    currenLang?: ELanguage;
    data: WithUserInfo<ITemplateSelect>;
}

export const TemplateContextProvider: FC<IProps & PropsWithChildren> = (props) => {
    const {data, children, currenLang} = props;

    const {mutateAsync} = useUpdateTemplateMutation(data.id);

    const onUpdate = async (value: ITemplateSelect) => {
        try {
            const res = await mutateAsync(value);
            toaster.add({
                text: 'Шаблон обновлен',
            });

            return res;
        } catch (error) {
            toaster.add({
                type: 'danger',
                text: 'Неудально обновить шаблон',
            });
        }
    };

    const currentLang = useMemo(() => {
        return currenLang ? data.settings[currenLang] : undefined;
    }, [data, currenLang]);

    return (
        <TemplateContext.Provider
            value={{
                actions: {
                    onUpdate,
                },
                state: {
                    template: data,
                    lang: currentLang,
                },
            }}
        >
            {children}
        </TemplateContext.Provider>
    );
};
