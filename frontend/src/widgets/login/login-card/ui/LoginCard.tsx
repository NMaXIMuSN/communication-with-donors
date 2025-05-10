'use client';

import {Button, Card, Text, TextInput} from '@gravity-ui/uikit';
import {Field, Form} from 'react-final-form';
import {useRouter} from 'next/navigation';
import {axios} from '@/shared/api/axios';
import {useMutation} from '@tanstack/react-query';
import {toaster} from '@/shared/toaster/notification';

type LoginFormValues = {
    email: string;
    password: string;
};

const login = async (values: LoginFormValues) => {
    const {data} = await axios.post('/auth/login', values);
    return data;
};

export default function LoginCard() {
    const router = useRouter();

    const {mutateAsync, isPending} = useMutation({
        mutationFn: login,
        onSuccess: () => {
            router.push('/');
        },
    });

    const handleSubmit = async (values: LoginFormValues) => {
        try {
            await mutateAsync(values);
        } catch (error) {
            toaster.add({
                text: 'Неверный email или пароль',
                type: 'danger',
            });
        }
    };

    const validateForm = (values: LoginFormValues) => {
        const errors: Partial<LoginFormValues> = {};
        if (!values.email) {
            errors.email = 'Введите email';
        }
        if (!values.password) {
            errors.password = 'Введите пароль';
        }
        return errors;
    };

    return (
        <Card view="raised" theme="normal" style={{width: 400, padding: 32}}>
            <Text variant="header-1" style={{marginBottom: 12}}>
                Вход в систему
            </Text>

            <Form<LoginFormValues>
                onSubmit={handleSubmit}
                validate={validateForm}
                render={({handleSubmit}) => (
                    <form onSubmit={handleSubmit}>
                        <Field name="email">
                            {({input, meta}) => (
                                <TextInput
                                    {...input}
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="email"
                                    validationState={
                                        meta.touched && meta.error ? 'invalid' : undefined
                                    }
                                    errorMessage={
                                        meta.touched && meta.error ? meta.error : undefined
                                    }
                                    style={{marginBottom: 12}}
                                />
                            )}
                        </Field>

                        <Field name="password">
                            {({input, meta}) => (
                                <TextInput
                                    {...input}
                                    type="password"
                                    placeholder="Пароль"
                                    autoComplete="current-password"
                                    validationState={
                                        meta.touched && meta.error ? 'invalid' : undefined
                                    }
                                    errorMessage={
                                        meta.touched && meta.error ? meta.error : undefined
                                    }
                                    style={{marginBottom: 16}}
                                />
                            )}
                        </Field>

                        <Button
                            view="action"
                            size="l"
                            type="submit"
                            width="max"
                            loading={isPending}
                        >
                            Войти
                        </Button>
                    </form>
                )}
            />
        </Card>
    );
}
