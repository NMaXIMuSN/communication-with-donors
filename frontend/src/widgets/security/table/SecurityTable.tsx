import {ColumnType, TableColumn, TableRow} from '@/shared/ui';
import dynamic from 'next/dynamic';
import {useRoleList} from '@/entities/security/api/queryHook';
import {IRoleWithPermission} from '@/entities/security/api/fetch';
import {noop} from 'lodash';
import {useState} from 'react';
import {AddRole} from '@/features/security/AddRole';

const InfiniteEntityTable = dynamic(
    () =>
        import('@/shared/ui/InfiniteEntityTable').then(
            (module) => module.InfiniteEntityTable<TableRow<IRoleWithPermission>>,
        ),
    {
        ssr: false,
    },
);

export const SecurityTable = () => {
    const {data} = useRoleList();

    const headers: TableColumn<TableRow<IRoleWithPermission>>[] = [
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
    ];

    const [currentRole, setCurrentRole] = useState<IRoleWithPermission>();

    return (
        <>
            <InfiniteEntityTable
                filterObj={{}}
                getListRequest={noop}
                data={data}
                onRowClick={setCurrentRole}
                columns={headers}
            />
            <AddRole
                initialRole={currentRole}
                isOpen={Boolean(currentRole)}
                renderButton={() => <></>}
                onClose={() => setCurrentRole(undefined)}
            />
        </>
    );
};
