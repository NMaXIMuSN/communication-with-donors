'use client';

import _axios from 'axios';
import Cookies from 'js-cookie';

const axios = _axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export class AxiosError {
    code: string;
    message: string;
    status: number;

    constructor(error: {code: string; message: string; status: number}) {
        this.code = error.code;
        this.message = error.message;
        this.status = error.status;
    }
}

axios.interceptors.request.use((config) => {
    const csrfToken = Cookies.get('csrfToken');
    if (csrfToken && config.headers) {
        config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove('accessToken');
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        if (error.response?.status === 403) {
            if (typeof window !== 'undefined' && window.location.pathname !== '/403') {
                window.location.href = '/403';
            }
        }

        return Promise.reject(new AxiosError(error.response.data));
    },
);

export {axios};
