'use client';

import React, {useState} from 'react';
import {Loader as GUILoader} from '@gravity-ui/uikit';

import {useInfiniteScroll} from '@/shared/ui';

import styles from './Loader.module.scss';
import {noop} from 'lodash';

interface ILoaderProps {
    callback?: () => void;
    count?: number;
}

export const Loader: React.FC<ILoaderProps> = ({callback = noop, count = 0}) => {
    const [loaderElement, setLoaderElement] = useState<HTMLDivElement | null>(null);

    useInfiniteScroll({
        callback,
        element: loaderElement,
    });

    return (
        <div className={styles.infiniteLoader}>
            <div ref={count ? setLoaderElement : undefined} />
            <GUILoader size="m" />
        </div>
    );
};
