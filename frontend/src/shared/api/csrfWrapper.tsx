'use client';

import {ReactNode, useEffect} from 'react';
import Cookies from 'js-cookie';
import {axios} from './axios';

export function CSRFWrapper({children}: {children: ReactNode}) {
    useEffect(() => {
        async function fetchCsrf() {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}auth/csrf-token`);
            Cookies.set('csrfToken', res.data.csrfToken);
        }
        fetchCsrf();
    }, []);

    return <>{children}</>;
}
