import {ELanguage} from '@/shared/ui';
import {Checkbox, Text} from '@gravity-ui/uikit';
import {FC, ReactNode} from 'react';
import styles from './Creative.module.scss';
import {ECreativeStatus} from '../../api/fetch';
import {useChannelCreativeStatusMutation} from '../../api/queryHook';

interface IProps {
    campaignId: number;
    id: number;
    name: string;
    lang: ELanguage;
    deleteComponent: ReactNode;
    status: ECreativeStatus;
}

export const Creative: FC<IProps> = ({campaignId, id, status, lang, name, deleteComponent}) => {
    const {mutate} = useChannelCreativeStatusMutation(campaignId);
    return (
        <div className={styles.creative}>
            <Checkbox checked={status === ECreativeStatus.ACTIVE} onUpdate={() => mutate(id)} />
            <Text variant="subheader-2">
                [{lang}] {name}
            </Text>
            <div className={styles.delete}>{deleteComponent}</div>
        </div>
    );
};
