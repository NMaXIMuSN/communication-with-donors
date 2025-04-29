import {useQuery} from '@tanstack/react-query';
import {TableColumn} from '../..';
import {axios} from '@/shared/api/axios';
import {EMPTY_DASH} from '@/shared/ui/filters';

export function toUserCellTemplate<ItemType>(
    column: TableColumn<ItemType>,
): (item: ItemType, index: number) => React.ReactNode {
    return function statusCellTemplate(item) {
        return <UserCell user={item[column.accessorKey] as number} />;
    };
}

export type UserCellProps = {
    user: number;
};

const fetchUser = async (
    id: number,
): Promise<{
    id: number;
    email: string;
}> => {
    const response = await axios.get(`/users/${id}`);
    return response.data;
};

export function UserCell(props: UserCellProps) {
    const {user} = props;

    const {data} = useQuery({
        queryKey: ['user', user],
        queryFn: () => fetchUser(user),
        enabled: Boolean(user),
    });

    return <div>{data?.email || EMPTY_DASH}</div>;
}
