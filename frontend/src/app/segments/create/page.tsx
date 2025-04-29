'use client';

import {Source} from '@/entities/sources/api/fetchers';
import {isRequired, useValidation} from '@/shared/lib/validation';
import ReactFinalForm from '@/shared/ui/form/ReactFinalForm';
import {Breadcrumbs} from '@/widgets/breadcrumbs/ui/Breadcrumbs';
import {toaster} from '@gravity-ui/uikit/toaster-singleton';
import {useRouter} from 'next/navigation';
import arrayMutators from 'final-form-arrays';
import {PageContentWrapper} from '@/widgets/page';
import {useCreateSegmentMutation} from '@/entities/segmnets/api/queryHook';
import {CREATE_SEGMENT, ONE_SEGMENT, SEGMENTS} from '@/shared/route';
import {MainInfoForm} from '@/entities/segmnets/ui/MainInfoForm/MainInfoForm';
import {Button, Flex} from '@gravity-ui/uikit';
import {SourceFormCard} from '@/entities/segmnets/ui/SourceFormCard/SourceFormCard';
import Link from 'next/link';
import {Permissions, useGetPermission} from '@/shared/api/permissions';
import {useEffect} from 'react';

interface IFormValue {
    name: string;
    description?: string;
    source: Source[];
}

const Sources = () => {
    const {validateForm} = useValidation<Partial<IFormValue>>({
        scheme: {
            name: [
                {validationCallback: isRequired, errorMessage: 'Обязательное поле для заполнения'},
            ],
            description: [],
            source: [
                {
                    validationCallback(value) {
                        return Boolean(value?.length);
                    },
                    errorMessage: 'Укажите хотя бы один источник',
                },
            ],
        },
    });

    const {mutateAsync} = useCreateSegmentMutation();
    const {push} = useRouter();

    const onSubmit = async (value: IFormValue) => {
        try {
            const res = await mutateAsync({
                description: value.description,
                name: value.name,
                sourceId: value.source.map((el) => el.id),
            });

            push(ONE_SEGMENT(res.id));
        } catch (error) {
            toaster.add({
                name: 'error',
                content: 'Не удалось создать источник',
            });
        }
    };

    const canCreate = useGetPermission(Permissions.SEGMENT.CREATE);
    useEffect(() => {
        if (!canCreate) {
            push('/403');
        }
    }, [canCreate]);

    return (
        <div>
            <Breadcrumbs
                items={[
                    {href: SEGMENTS, text: 'Сегменты'},
                    {href: CREATE_SEGMENT, text: 'Создание сегмента'},
                ]}
            />
            <PageContentWrapper>
                <ReactFinalForm<IFormValue>
                    validate={validateForm}
                    onSubmit={onSubmit}
                    mutators={{
                        ...arrayMutators,
                    }}
                >
                    {() => (
                        <Flex direction={'column'} gap={2}>
                            <MainInfoForm />
                            <SourceFormCard />
                            <Flex gap={2}>
                                <Link href={SEGMENTS}>
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

export default Sources;
