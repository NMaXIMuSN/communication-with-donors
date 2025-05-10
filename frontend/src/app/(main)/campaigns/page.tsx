'use client';

import {Permissions, useGetPermission} from '@/shared/api/permissions';
import {CAMPAIGNS, CREATE_CAMPAIGN} from '@/shared/route';
import {Breadcrumbs} from '@/widgets/breadcrumbs/ui/Breadcrumbs';
import {CampaignsTable} from '@/widgets/campaigns/table';
import {Button} from '@gravity-ui/uikit';
import Link from 'next/link';

const Campaigns = () => {
    const canCreate = useGetPermission(Permissions.CAMPAIGN.CREATE);

    return (
        <div>
            <Breadcrumbs
                items={[{href: CAMPAIGNS, text: 'Кампании'}]}
                actionsComponent={
                    canCreate && (
                        <Link href={CREATE_CAMPAIGN}>
                            <Button view="action">Создание кампанию</Button>
                        </Link>
                    )
                }
            />
            <CampaignsTable />
        </div>
    );
};

export default Campaigns;
