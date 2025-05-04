import {useCreateSourceMutation} from '@/entities/sources';
import {useUser} from '@/shared/providers/userProvider';
import {Button} from '@gravity-ui/uikit';

export const CreateSource = () => {
    const {mutateAsync} = useCreateSourceMutation();
    const user = useUser();
    const handleCreate = async () => {
        if (!user) return;

        await mutateAsync({
            name: 'Тест источник',
            tableName: 'test_table',
            description: 'Тестовое описание',
            systemName: 'test_source',
        });
    };
    return (
        <div>
            <Button onClick={handleCreate}>Создать</Button>
        </div>
    );
};
