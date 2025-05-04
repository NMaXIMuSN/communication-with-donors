'use client';

import {Breadcrumbs as BreadcrumbsGravity, Flex} from '@gravity-ui/uikit';
import Link from 'next/link';

import styles from './Breadcrumbs.module.scss';

export interface IBreadcrumbsItems {
    text: string;
    href: string;
}

interface IProps {
    items: IBreadcrumbsItems[];
    actionsComponent?: React.ReactNode;
}

export const Breadcrumbs: React.FC<IProps> = ({items, actionsComponent}) => {
    return (
        <Flex justifyContent="space-between" className={styles.wrapper}>
            <BreadcrumbsGravity className={styles.breadcrumbs}>
                {items.map(({href, text}) => (
                    <Link className="g-breadcrumbs__link" key={href} href={href}>
                        {text}
                    </Link>
                ))}
            </BreadcrumbsGravity>
            {actionsComponent && <Flex gap={2}>{actionsComponent}</Flex>}
        </Flex>
    );
};
