'use client';

import {Permissions, useGetPermission} from '@/shared/api/permissions';
import {Breadcrumbs} from '@/widgets/breadcrumbs/ui/Breadcrumbs';
import {SourcesTable} from '@/widgets/sources/table';
import {Button} from '@gravity-ui/uikit';
import Link from 'next/link';

const Sources = () => {
    const canCreate = useGetPermission(Permissions.SOURCE.CREATE);

    return (
        <div>
            <Breadcrumbs
                items={[{href: '/sources', text: 'Источники'}]}
                actionsComponent={
                    canCreate && (
                        <Link href={'/sources/create'}>
                            <Button view="action">Создание источника</Button>
                        </Link>
                    )
                }
            />
            <SourcesTable />
        </div>
    );
};

export default Sources;
