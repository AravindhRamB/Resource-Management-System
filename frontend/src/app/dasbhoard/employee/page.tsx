'use client';

import { useState } from 'react';
import type { TabsProps } from 'antd';
import { CustomTabs } from '@/components/ui/tabs';
import {OnboardingLayout} from '@/components/layout/employeeLayout/onboardingLayout'
import {AnalyticsLayout} from '@/components/layout/employeeLayout/analyticsLayout';
import {EmployeeListLayout} from '@/components/layout/employeeLayout/employeelistLayout';

export default function AttendancePage() {
    const [activeTab, setActiveTab] = useState('analytics');

    // Function to handle successful form submission
    const handleFormSuccess = () => {
        // Switch to analytics tab after successful submission
        setActiveTab('analytics');
    };

    const employeeTabs: TabsProps['items'] = [
        {
            key: 'analytics',
            label: 'Analytics',
            children: <AnalyticsLayout/>,
        },
        {
            key: 'employeeList',
            label: 'Employee List',
            children: <EmployeeListLayout/>
        },
        {
            key: 'joiningForm',
            label: 'Onboarding',
            children: <OnboardingLayout/>,
        },
    ];

    const handleTabsChange = (key: string) => {
        console.log('Switched to tab:', key);
        setActiveTab(key);
    };

    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold">Employee</h1>
            <div className="mt-6">
                <CustomTabs
                    activeKey={activeTab}
                    items={employeeTabs}
                    onChange={handleTabsChange}
                />
            </div>
        </main>
    );
}