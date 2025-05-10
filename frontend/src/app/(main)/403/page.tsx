'use client';
import Card from '@/shared/ui/Card/Card';
import {Button, Flex, Text} from '@gravity-ui/uikit';
import Link from 'next/link';
import styles from './page.module.scss';

const Campaigns = () => {
    return (
        <Flex width="100%" height="100vh" alignItems="center" justifyContent="center">
            <Card title="Доступ запрещён" className={styles.card}>
                <Text>К сожалению, у вас нет прав доступа к этому разделу</Text>
                <Link href="/">
                    <Button>На главную</Button>
                </Link>
            </Card>
        </Flex>
    );
};

export default Campaigns;
