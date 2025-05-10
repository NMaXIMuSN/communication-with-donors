'use client';

import {AddRole} from '@/features/security/AddRole';
import {Permissions, useGetPermission} from '@/shared/api/permissions';
import {SECURITY} from '@/shared/route';
import {Breadcrumbs} from '@/widgets/breadcrumbs/ui/Breadcrumbs';
import {SecurityTable} from '@/widgets/security';

const Security = () => {
    const canCreate = useGetPermission(Permissions.USER.SEARCH);

    return (
        <div>
            <Breadcrumbs
                items={[{href: SECURITY, text: 'Безопасность'}]}
                actionsComponent={canCreate && <AddRole />}
            />
            <SecurityTable />
        </div>
    );
};

export default Security;
