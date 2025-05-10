import {ISearchUsers} from '@/entities/user/api/fetch';
import {useSearchUsers} from '@/entities/user/api/queryHook';
import {useDebounceState} from '@/shared/lib';
import {ColumnType, DateFormat, TableColumn, TableRow} from '@/shared/ui';
import {Flex, Label, TextInput} from '@gravity-ui/uikit';
import dynamic from 'next/dynamic';
import {useCallback, useMemo, useState} from 'react';
import styles from './UsersTable.module.scss';
import {UserEdit} from '@/features/users/user-edit/UserEdit';
import {noop} from 'lodash';

const InfiniteEntityTable = dynamic(
    () =>
        import('@/shared/ui/InfiniteEntityTable').then(
            (module) => module.InfiniteEntityTable<TableRow<ISearchUsers>, {search: string}>,
        ),
    {
        ssr: false,
    },
);

export const UsersTable = () => {
    const {mutateAsync, data} = useSearchUsers();

    const [list, setList] = useState<TableRow<ISearchUsers>[]>([]);

    const [search, searchDeb, setSearch] = useDebounceState('', 300);

    const updateUser = (user: ISearchUsers) => {
        setList((p) =>
            p.map((_user) => {
                if (user.email !== _user.email) {
                    return _user;
                }

                return {
                    ..._user,
                    role: user.role,
                };
            }),
        );
    };

    const headers: TableColumn<TableRow<ISearchUsers>>[] = [
        {
            accessorKey: 'id',
            type: ColumnType.PLANE_TEXT,
            header: 'ID',
            maxLines: 1,
            size: 40,
        },
        {
            accessorKey: 'name',
            type: ColumnType.PLANE_TEXT,
            header: 'Название',
            maxLines: 1,
            size: 250,
        },
        {
            accessorKey: 'email',
            type: ColumnType.PLANE_TEXT,
            header: 'Почта',
            maxLines: 1,
            size: 250,
        },
        {
            accessorKey: 'createdAt',
            type: ColumnType.DATE_TIME,
            header: 'Дата регистрации',
            dateFormat: DateFormat.DD_MONTH_YEAR,
            size: 250,
        },
        {
            accessorKey: 'role',
            type: ColumnType.CUSTOM_ACTION,
            header: 'Роли',
            size: 250,
            template: (user) => {
                return (
                    <Flex gap={1} wrap>
                        {user.role.map((role) => (
                            <Label key={role.id}>{role.name}</Label>
                        ))}
                    </Flex>
                );
            },
        },
    ];

    const getListRequest = useCallback(
        async (filterObj: {search: string}, limit: number, offset: number) => {
            try {
                const {data} = await mutateAsync({
                    limit,
                    offset,
                    search: filterObj.search,
                });
                setList((currentList) => (offset === 0 ? [...data] : [...currentList, ...data]));
            } catch (error) {
                console.error(error);
            }
        },
        [mutateAsync],
    );

    const filterObj = useMemo(
        () => ({
            search: searchDeb,
        }),
        [searchDeb],
    );

    const [currentUser, setCurrentUser] = useState<ISearchUsers>();

    return (
        <div className={styles.table}>
            <div className={styles.search}>
                <TextInput
                    value={search}
                    onUpdate={setSearch}
                    placeholder="Поиск по имени id и почте"
                />
            </div>
            <InfiniteEntityTable
                filterObj={filterObj}
                getListRequest={getListRequest}
                data={data?.data || []}
                pagination={{
                    pages: data?.page.lastPage,
                }}
                columns={headers}
                useList={() => [list || [], noop]}
                onRowClick={setCurrentUser}
                isLoading={false}
                withRowBorder
            />
            <UserEdit
                user={currentUser}
                isOpen={Boolean(currentUser)}
                onClose={() => setCurrentUser(undefined)}
                updateUser={updateUser}
            />
        </div>
    );
};
