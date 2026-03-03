'use client';
import type { TabsProps } from 'antd';
import { CustomTabs } from '@/components/ui/tabs';
import {TimesheetForm} from '@/components/layout/timesheetLayout/timesheetform';
export default function TimesheetPage(){
    const timesheetTabs: TabsProps['items'] = [
        {
            key: 'timesheetForm',
            label: 'Timesheet Form',
            children: <TimesheetForm/>,
        },
        {
            key: 'timesheetSummary',
            label: 'Summary',
            children: <div>Timesheet Summary Content</div>,
        },
    ];

    const handleTabsChange = (key: string) => {
        console.log('Switched to tab:', key);
    };

    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold">Timesheet</h1>
            <div className="mt-6">
                <CustomTabs
                    defaultActiveKey="timesheetForm"
                    items={timesheetTabs}
                    onChange={handleTabsChange}
                />
            </div>
        </main>
    );
}