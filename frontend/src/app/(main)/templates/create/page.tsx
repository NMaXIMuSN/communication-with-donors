'use client';

import {useValidation} from '@/shared/lib/validation';
import ReactFinalForm from '@/shared/ui/form/ReactFinalForm';
import {Breadcrumbs} from '@/widgets/breadcrumbs/ui/Breadcrumbs';
import {toaster} from '@gravity-ui/uikit/toaster-singleton';
import {useRouter} from 'next/navigation';
import {PageContentWrapper} from '@/widgets/page';
import {CREATE_TEMPLATE, ONE_TEMPLATE, TEMPLATES} from '@/shared/route';
import {Button, Flex} from '@gravity-ui/uikit';
import Link from 'next/link';
import {useCreateTemplateMutation} from '@/entities/templates/api/queryHook';
import {TCreateTemplate} from '@/entities/templates/api/fetchers';
import {scheme} from '@/entities/templates/model/scheme';
import {MainInfoForm} from '@/entities/templates/ui/MainInfoForm/MainInfoForm';
import {Permissions, useGetPermission} from '@/shared/api/permissions';
import {useEffect} from 'react';

const TemplateCreate = () => {
    const {validateForm} = useValidation<Partial<TCreateTemplate>>({
        scheme: scheme,
    });
    const {push} = useRouter();

    const {mutateAsync} = useCreateTemplateMutation();

    const onSubmit = async (value: TCreateTemplate) => {
        try {
            const res = await mutateAsync(value);
            push(ONE_TEMPLATE(res.id));
        } catch (error) {
            toaster.add({
                name: 'error',
                content: 'Не удалось создать шаблон',
            });
        }
    };

    const canCreate = useGetPermission(Permissions.TEMPLATE.CREATE);
    useEffect(() => {
        if (!canCreate) {
            push('/403');
        }
    }, [canCreate]);

    return (
        <div>
            <Breadcrumbs
                items={[
                    {href: TEMPLATES, text: 'Шаблоны'},
                    {href: CREATE_TEMPLATE, text: 'Создание шаблона'},
                ]}
            />
            <PageContentWrapper>
                <ReactFinalForm<TCreateTemplate> validate={validateForm} onSubmit={onSubmit}>
                    {() => (
                        <Flex direction={'column'} gap={2}>
                            <MainInfoForm />
                            <Flex gap={2}>
                                <Link href={TEMPLATES}>
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

export default TemplateCreate;
