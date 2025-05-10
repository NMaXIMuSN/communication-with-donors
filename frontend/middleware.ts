import {NextComponentType} from 'next';
import {WithRouterProps} from 'next/dist/client/with-router';
import {BaseContext, NextPageContext} from 'next/dist/shared/lib/utils';

export const withAuth = <P extends WithRouterProps, C extends BaseContext = NextPageContext>(
    Component: NextComponentType<C, any, P>,
) => {
    return function AuthComponent(props: P) {
        const {router} = props;
        // Здесь можно добавить логику для проверки наличия токена
        // Если токена нет, перенаправить на страницу входа
        if (!localStorage.getItem('jwtToken')) {
            router.push('/login');
        }
        return Component;
    };
};
