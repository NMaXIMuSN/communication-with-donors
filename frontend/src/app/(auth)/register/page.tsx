'use client';

import {IRegisterData} from '@/entities/user/api/fetch';
import {useRegInfo, useRegister} from '@/entities/user/api/queryHook';
import {FormFieldText, FormRow} from '@/shared/ui';
import Card from '@/shared/ui/Card/Card';
import ReactFinalForm from '@/shared/ui/form/ReactFinalForm';
import {Button} from '@gravity-ui/uikit';
import {useRouter, useSearchParams} from 'next/navigation';
import {Field} from 'react-final-form';

interface IValue extends IRegisterData {
    email: string;
    passwordVerify: string;
}

const Register = () => {
    const token = useSearchParams().get('hash') ?? '';
    const hash = encodeURIComponent(token);
    const router = useRouter();

    const {data, isError} = useRegInfo(hash);
    const {mutate} = useRegister(hash);

    const onSubmit = (value: IValue) => {
        if (value.password !== value.passwordVerify) {
            return;
        }

        mutate(
            {
                name: value.name,
                password: value.password,
            },
            {
                onSuccess() {
                    router.push('/');
                },
            },
        );
    };

    if (isError) {
        router.push('/login');
    }
    return (
        <Card>
            <ReactFinalForm<IValue> onSubmit={onSubmit} initialValues={{email: data?.email}}>
                {() => (
                    <>
                        <FormRow label="Email">
                            {() => (
                                <Field name="email">
                                    {(props) => <FormFieldText {...props} disabled />}
                                </Field>
                            )}
                        </FormRow>
                        <FormRow label="Имя" required>
                            {() => (
                                <Field name="name">
                                    {(props) => <FormFieldText {...props} autoComplete={false} />}
                                </Field>
                            )}
                        </FormRow>
                        <FormRow label="Пароль" required>
                            {() => (
                                <Field name="password">
                                    {(props) => (
                                        <FormFieldText
                                            {...props}
                                            type="password"
                                            autoComplete={false}
                                        />
                                    )}
                                </Field>
                            )}
                        </FormRow>
                        <FormRow label="Повторите пароль" required>
                            {() => (
                                <Field name="passwordVerify">
                                    {(props) => (
                                        <FormFieldText
                                            {...props}
                                            type="password"
                                            autoComplete={false}
                                        />
                                    )}
                                </Field>
                            )}
                        </FormRow>
                        <Button type="submit">Зарегистрироваться</Button>
                    </>
                )}
            </ReactFinalForm>
        </Card>
    );
};

export default Register;
