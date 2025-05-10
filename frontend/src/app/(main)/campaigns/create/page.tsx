'use client';

import {useValidation} from '@/shared/lib/validation';
import ReactFinalForm from '@/shared/ui/form/ReactFinalForm';
import {Breadcrumbs} from '@/widgets/breadcrumbs/ui/Breadcrumbs';
import {toaster} from '@gravity-ui/uikit/toaster-singleton';
import {useRouter} from 'next/navigation';
import {PageContentWrapper} from '@/widgets/page';
import {CAMPAIGNS, CREATE_CAMPAIGN, ONE_CAMPAIGN} from '@/shared/route';
import {Button, Flex} from '@gravity-ui/uikit';
import Link from 'next/link';
import {MainInfo} from '@/entities/campaigns/ui/createCard/MainInfo';
import {SegmentInfo} from '@/entities/campaigns/ui/createCard/SegmentInfo';
import {ICreateCampaign} from '@/entities/campaigns/api/fetch';
import {scheme} from '@/entities/campaigns/model/scheme';
import {useCreateCampaignMutation} from '@/entities/campaigns/api/queryHook';
import {useEffect} from 'react';
import {Permissions, useGetPermission} from '@/shared/api/permissions';

const CampaignCreate = () => {
    const {validateForm} = useValidation<Partial<ICreateCampaign>>({
        scheme: scheme,
    });
    const {push} = useRouter();
    const canCreate = useGetPermission(Permissions.CAMPAIGN.CREATE);

    const {mutateAsync} = useCreateCampaignMutation();

    const onSubmit = async (value: ICreateCampaign) => {
        try {
            const res = await mutateAsync(value);
            push(ONE_CAMPAIGN(res.id));
        } catch (error) {
            toaster.add({
                name: 'error',
                content: 'Не удалось создать источник',
            });
        }
    };

    useEffect(() => {
        if (!canCreate) {
            push('/403');
        }
    }, [canCreate]);

    return (
        <div>
            <Breadcrumbs
                items={[
                    {href: CAMPAIGNS, text: 'Кампании'},
                    {href: CREATE_CAMPAIGN, text: 'Создание кампании'},
                ]}
            />
            <PageContentWrapper>
                <ReactFinalForm<ICreateCampaign> validate={validateForm} onSubmit={onSubmit}>
                    {() => (
                        <Flex direction={'column'} gap={2}>
                            <MainInfo />
                            <SegmentInfo />
                            <Flex gap={2}>
                                <Link href={CAMPAIGNS}>
                                    <Button>Отмена</Button>
                                </Link>
                                <Button view="action" type={'submit'}>
                                    Сохранить
                                </Button>
                            </Flex>
                        </Flex>
                    )}
                </ReactFinalForm>
            </PageContentWrapper>
        </div>
    );
};

export default CampaignCreate;
