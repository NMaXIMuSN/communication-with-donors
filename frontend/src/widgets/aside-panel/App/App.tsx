'use client';

import React from 'react';

import {Ghost} from '@gravity-ui/icons';
import {AsideHeader} from '@gravity-ui/navigation';

import {Wrapper} from '../Wrapper/Wrapper';
import {useGetMenuItems} from '@/shared/route';

interface AppProps {
    children: React.ReactNode;
}

export const App: React.FC<AppProps> = ({children}) => {
    const [compact, setCompact] = React.useState(false);
    const menuItems = useGetMenuItems();
    return (
        <AsideHeader
            logo={{icon: Ghost, text: 'CRM Donors'}}
            compact={compact}
            onChangeCompact={setCompact}
            menuItems={menuItems}
            renderContent={() => <Wrapper>{children}</Wrapper>}
        />
    );
};
