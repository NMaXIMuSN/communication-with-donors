import {Flex, Tab, TabList, TabPanel, TabProvider} from '@gravity-ui/uikit';
import {ReactNode, useState} from 'react';

import styles from './Tabs.module.scss';

export interface ITabs<T> {
    title: string;
    value: T;
    action?: (action: ITabs<T>) => ReactNode;
    default?: boolean;
    children: ReactNode;
}

interface IProps<T extends string> {
    activeTab?: T;
    setActiveTab?: (tab: T) => void;
    tabs: ITabs<T>[];
    actions?: ReactNode;
}

export const Tabs = <T extends string>(props: IProps<T>) => {
    const {tabs, actions, activeTab: activeTabP, setActiveTab: setActiveTabP} = props;

    const [activeTab, setActiveTab] = useState((tabs.find((tab) => tab.default) || tabs[0])?.value);
    return (
        <TabProvider
            value={activeTabP || activeTab}
            onUpdate={(value) => (setActiveTabP || setActiveTab)(value as T)}
        >
            <TabList className={styles.tabsList}>
                <Flex>
                    {tabs.map((tab) => (
                        <Tab value={tab.value} key={tab.value}>
                            <Flex gap={1}>
                                {tab.title}
                                {tab.action && tab.action(tab)}
                            </Flex>
                        </Tab>
                    ))}
                </Flex>
                <Flex>{actions}</Flex>
            </TabList>
            <div>
                {tabs.map((tab) => (
                    <TabPanel value={tab.value} key={tab.value}>
                        {tab.children}
                    </TabPanel>
                ))}
            </div>
        </TabProvider>
    );
};
