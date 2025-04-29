'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useState} from 'react';
import {UserProvider} from './userProvider';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {Toaster, ToasterComponent, ToasterProvider} from '@gravity-ui/uikit';
import {toaster} from '../toaster/notification/Toaster/Toaster';
import {ThemeProvider} from './theme';

export default function Providers({children}: {children: React.ReactNode}) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false, // отключаем автоматический retry по умолчанию
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    );

    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <UserProvider>
                    <ToasterProvider toaster={toaster as unknown as Toaster}>
                        {children}
                        <ToasterComponent className="optional additional classes" />
                    </ToasterProvider>
                </UserProvider>

                {process.env.NODE_ENV === 'development' && (
                    <ReactQueryDevtools initialIsOpen={false} />
                )}
            </QueryClientProvider>
        </ThemeProvider>
    );
}
