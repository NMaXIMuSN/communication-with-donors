'use client';

import React from 'react';
import {Breadcrumbs} from '@gravity-ui/uikit';

export type AppProps = {
    children: React.ReactNode;
};

export const Wrapper: React.FC<AppProps> = ({children}) => {
    return (
        <div>
            <div>
                <div>
                    <Breadcrumbs children={'asdf'} />
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};
