'use client';
import type { TabsProps } from 'antd';
import { CustomTabs } from '@/components/ui/tabs';
import {ApplyReimbursement} from '@/components/layout/reimbursementLayout/applyreimbursement';
export default function ReimbursementPage(){
    const reimbursementTabs: TabsProps['items'] = [
        {
            key: 'reimbursementForm',
            label: 'Apply',
            children: <ApplyReimbursement/>,
        },
        {
            key:'reimbursementSummary',
            label: 'Summary',
            children: <div>Reimbursement Summary Content</div>,

        },
        {
            key: 'reimbursementList',
            label: 'Status',
            children: <div>Reimbursement List Content</div>,
        },
    ];

    const handleTabsChange = (key: string) => {
        console.log('Switched to tab:', key);
    };

    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold">Reimbursement</h1>
            <div className="mt-6">
                <CustomTabs
                    defaultActiveKey="reimbursementForm"
                    items={reimbursementTabs}
                    onChange={handleTabsChange}
                />
            </div>
        </main>
    );
}