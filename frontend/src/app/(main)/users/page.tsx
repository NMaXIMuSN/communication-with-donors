'use client';

import {AddUser} from '@/features/users/add-user/addUser';
import {Permissions, useGetPermission} from '@/shared/api/permissions';
import {USERS} from '@/shared/route';
import {Breadcrumbs} from '@/widgets/breadcrumbs/ui/Breadcrumbs';
import {UsersTable} from '@/widgets/users';

const Users = () => {
    const canCreate = useGetPermission(Permissions.USER.SEARCH);

    return (
        <div>
            <Breadcrumbs
                items={[{href: USERS, text: 'Пользователи'}]}
                actionsComponent={canCreate && <AddUser />}
            />
            <UsersTable />
        </div>
    );
};

export default Users;
