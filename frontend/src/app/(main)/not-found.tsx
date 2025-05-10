'use client';

import Card from '@/shared/ui/Card/Card';
import {Flex} from '@gravity-ui/uikit';

export default function NotFound() {
    return (
        <Flex justifyContent="center" alignItems="center" height="100vh">
            <Card title="Страница не найдена">
                Перейдите пожалуйста на разделы представлены в боковой панели.
            </Card>
        </Flex>
    );
}
