'use client';

import {Permissions, useGetPermission} from '@/shared/api/permissions';
import {CREATE_SEGMENT, SEGMENTS} from '@/shared/route';
import {Breadcrumbs} from '@/widgets/breadcrumbs/ui/Breadcrumbs';
import {SegmentsTable} from '@/widgets/segments/table/ui/SegmentsTable';
import {Button} from '@gravity-ui/uikit';
import Link from 'next/link';

const Segments = () => {
    const canCreate = useGetPermission(Permissions.SEGMENT.CREATE);
    return (
        <div>
            <Breadcrumbs
                items={[{href: SEGMENTS, text: 'Сегменты'}]}
                actionsComponent={
                    canCreate && (
                        <Link href={CREATE_SEGMENT}>
                            <Button view="action">Создание сегмента</Button>
                        </Link>
                    )
                }
            />
            <SegmentsTable />
        </div>
    );
};

export default Segments;
