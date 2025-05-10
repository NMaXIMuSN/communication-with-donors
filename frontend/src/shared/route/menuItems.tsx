'use client';

import {BranchesDown, ChartPie, Envelope, FileText, Lock, Person} from '@gravity-ui/icons';
import {MenuItem} from '@gravity-ui/navigation';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

export const menuItems: MenuItem[] = [
    {title: 'Источники', id: 'sources', icon: BranchesDown},
    {title: 'Сегменты', id: 'segments', icon: ChartPie},
    {title: 'Шаблоны', id: 'templates', icon: FileText},
    {title: 'Кампании', id: 'campaigns', icon: Envelope},
    {title: 'Пользователи', id: 'users', icon: Person},
    {title: 'Роли', id: 'security', icon: Lock},
];

export const useGetMenuItems = () => {
    const pathname = usePathname();

    const menuItemsWithActive: MenuItem[] = menuItems.map((item) => {
        return {
            ...item,
            current: pathname.startsWith(`/${item.id}`),
            itemWrapper(p, makeItem, opts) {
                return (
                    <Link href={`/${opts.item.id}`} style={{width: '100%', height: '100%'}}>
                        {makeItem(p)}
                    </Link>
                );
            },
        };
    });
    return menuItemsWithActive;
};
