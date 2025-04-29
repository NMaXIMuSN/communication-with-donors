'use client';

import React from 'react';
import {Theme, ThemeProvider as _ThemeProvider} from '@gravity-ui/uikit';

// const DARK = 'dark';
const LIGHT = 'light';
const DEFAULT_THEME = LIGHT;

export const DEFAULT_BODY_CLASSNAME = `g-root g-root_theme_${DEFAULT_THEME}`;

export type AppProps = {
    children: React.ReactNode;
};

export const ThemeProvider: React.FC<AppProps> = ({children}) => {
    const [theme] = React.useState<Theme>(DEFAULT_THEME);

    return <_ThemeProvider theme={theme}>{children}</_ThemeProvider>;
};
