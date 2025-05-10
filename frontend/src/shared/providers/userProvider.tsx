'use client';

import {ReactNode, createContext, useContext} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {axios} from '../api/axios';
import {Loader} from '@gravity-ui/uikit';
import {usePathname} from 'next/navigation';

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
    createdAt: string;
    updatedAt: string;
};

type AuthContextType = {
    user?: User;
    isLoading: boolean;
};

const UserContext = createContext<AuthContextType>({
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

export const useUpdateMe = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: {name: string; password?: string; newPassword?: string}) => {
            await axios.post('users/me', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['currentUser'],
            });
        },
    });
};

export function UserProvider({children}: {children: ReactNode}) {
    const pathname = usePathname();

    const {data: user, isLoading} = useQuery({
        queryKey: ['currentUser'],
        queryFn: fetchCurrentUser,
        retry: 3,
        enabled: !(pathname.includes('/login') || pathname.includes('/register')),
    });

    if (isLoading) {
        return <Loader />;
    }

    return (
        <UserContext.Provider value={{user: user || undefined, isLoading}}>
            {children}
        </UserContext.Provider>
    );
}

export const useAuth = () => useContext(UserContext);
export const useUser = () => useContext(UserContext).user;
