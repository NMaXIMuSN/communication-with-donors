'use client';

import {ReactNode, createContext, useContext} from 'react';
import {useQuery} from '@tanstack/react-query';
import {axios} from '../api/axios';
import {Loader} from '@gravity-ui/uikit';

export interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

export interface Permission {
    id: number;
    value: string;
}

export type User = {
    id: number;
    name: string;
    email: string;
    role: Role[];
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
};

const UserContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
});

const fetchCurrentUser = async (): Promise<User | null> => {
    try {
        const {data} = await axios.get('/users/me');

        return data ?? null;
    } catch {
        return null;
    }
};

export function UserProvider({children}: {children: ReactNode}) {
    const {data: user, isLoading} = useQuery({
        queryKey: ['currentUser'],
        queryFn: fetchCurrentUser,
        retry: 3,
    });

    if (isLoading) {
        return <Loader />;
    }

    return (
        <UserContext.Provider value={{user: user ?? null, isLoading}}>
            {children}
        </UserContext.Provider>
    );
}

export const useAuth = () => useContext(UserContext);
export const useUser = () => useContext(UserContext).user;
