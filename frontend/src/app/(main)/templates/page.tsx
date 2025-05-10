'use client';

import {Permissions, useGetPermission} from '@/shared/api/permissions';
import {CREATE_TEMPLATE, TEMPLATES} from '@/shared/route';
import {Breadcrumbs} from '@/widgets/breadcrumbs/ui/Breadcrumbs';
import {TemplatesTable} from '@/widgets/templates/table';
import {Button} from '@gravity-ui/uikit';
import Link from 'next/link';

const Template = () => {
    const canCreate = useGetPermission(Permissions.TEMPLATE.CREATE);
    return (
        <div>
            <Breadcrumbs
                items={[{href: TEMPLATES, text: 'Шаблоны'}]}
                actionsComponent={
                    canCreate && (
                        <Link href={CREATE_TEMPLATE}>
                            <Button view="action">Создание шаблон</Button>
                        </Link>
                    )
                }
            />
            <TemplatesTable />
        </div>
    );
};

export default Template;
