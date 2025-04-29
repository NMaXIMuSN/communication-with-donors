import {FC, PropsWithChildren, createContext} from 'react';
import {ECampaignStatus, ICampaign, IChanel} from '../api/fetch';
import {useCampaignChannelsQuery, useCampaignStatusQuery} from '../api/queryHook';

interface IState {
    channels: IChanel[];
    status: ECampaignStatus;
    campaign: ICampaign;
}

interface IActions {}

interface IContextValue {
    state: IState;
    actions: IActions;
}

export const CampaignContext = createContext<IContextValue>({} as IContextValue);

interface IProps {
    data: ICampaign;
}

export const CampaignContextProvider: FC<IProps & PropsWithChildren> = (props) => {
    const {data, children} = props;

    const {data: channels} = useCampaignChannelsQuery(Number(data.id));
    const {data: status} = useCampaignStatusQuery(Number(data.id));
    return (
        <CampaignContext.Provider
            value={{
                actions: {},
                state: {
                    channels: channels || [],
                    campaign: data,
                    status: status?.status || ECampaignStatus.DEACTIVATED,
                },
            }}
        >
            {children}
        </CampaignContext.Provider>
    );
};
