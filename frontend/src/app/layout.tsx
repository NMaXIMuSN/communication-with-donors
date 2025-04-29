'use client';

import {DEFAULT_BODY_CLASSNAME} from '@/shared/providers/theme';
import {App} from '../widgets/aside-panel';

import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import '../shared/styles/globals.scss';
import Providers from '@/shared/providers/providers';

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en">
            <body className={DEFAULT_BODY_CLASSNAME}>
                <Providers>
                    <App>
                        <div>{children}</div>
                    </App>
                </Providers>
            </body>
        </html>
    );
}
