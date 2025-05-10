'use client';

import React, {useState} from 'react';

import {Ghost, Person} from '@gravity-ui/icons';
import {AsideHeader, FooterItem} from '@gravity-ui/navigation';
import {Wrapper} from '../Wrapper/Wrapper';
import {useGetMenuItems} from '@/shared/route';
import {useUser} from '@/shared/providers/userProvider';
import {UserEdit} from '@/features/users/user-edit/UserEdit';
import {useQueryClient} from '@tanstack/react-query';

interface AppProps {
    children: React.ReactNode;
}

export const App: React.FC<AppProps> = ({children}) => {
    const [compact, setCompact] = React.useState(false);
    const menuItems = useGetMenuItems();
    const queryClient = useQueryClient();
    const user = useUser();
    const [popupVisible, setPopupVisible] = useState(false);
    return (
        <AsideHeader
            logo={{icon: Ghost, text: 'CRM Donors'}}
            compact={compact}
            onChangeCompact={setCompact}
            menuItems={menuItems}
            renderContent={() => <Wrapper>{children}</Wrapper>}
            renderFooter={({compact}) => (
                <>
                    <FooterItem
                        compact={compact}
                        item={{
                            id: 'user',
                            title: user?.name,
                            icon: Person,
                            onItemClick: () => setPopupVisible(true),
                        }}
                    />
                    <UserEdit
                        user={user}
                        isOpen={popupVisible}
                        isMyEdit
                        updateUser={() =>
                            queryClient.invalidateQueries({
                                queryKey: ['currentUser'],
                            })
                        }
                        onClose={() => setPopupVisible(false)}
                    />
                </>
            )}
        />
    );
};
