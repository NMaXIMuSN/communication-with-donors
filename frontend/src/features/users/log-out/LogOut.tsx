import {useLogout} from '@/entities/user/api/queryHook';
import {Button} from '@gravity-ui/uikit';

export const LogOut = () => {
    const {mutate} = useLogout();

    return (
        <Button size="l" onClick={() => mutate()}>
            Выйти
        </Button>
    );
};
