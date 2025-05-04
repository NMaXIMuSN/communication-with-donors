'use client';

import {FC, PropsWithChildren, createContext, useEffect, useState} from 'react';
import {axios} from '../api/axios';
import { Loader } from '@gravity-ui/uikit';

export const UserContext = createContext({});

export const UserProvider: FC<PropsWithChildren> = ({children}) => {
    const [userData, setUserData] = useState<{}>();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await axios.get('/users/me');

                setUserData(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
    }, []);

    if (!userData) {
        return <Loader />
    }

    return <UserContext.Provider value={userData}>{children}</UserContext.Provider>;
};
