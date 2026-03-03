'use client';

import React from 'react';
import type { TabsProps } from 'antd';
import { CustomTabs } from '@/components/ui/tabs';

// Define the tabs for the attendance page
const attendanceTabs: TabsProps['items'] = [
  {
    key: 'today',
    label: 'Today Attendance',
    children: (
      <div>
        <h2>Today's Attendance Report</h2>
        <p>A list of all students present and absent today will be displayed here.</p>
      </div>
    ),
  },
  {
    key: 'weekly',
    label: 'Weekly Summary',
    children: (
      <div>
        <h2>Weekly Attendance Summary</h2>
        <p>Graphs and charts showing attendance trends for the current week.</p>
      </div>
    ),
  },
  {
    key: 'history',
    label: 'Attendance History',
    children: (
      <div>
        <h2>Past Attendance Records</h2>
        <p>A searchable table of all historical attendance records.</p>
      </div>
    ),
  },
];

const handleTabsChange = (key: string) => {
  console.log('Switched to tab:', key);
  // You would typically use this function to fetch data or update the UI
  // based on the selected tab (e.g., load weekly data when 'weekly' is selected).
};

export default function EmployeePage() {
  return (
    <main className="p-6">
      <h1>Attendance Dashboard</h1>
      <p>Select a tab to view different attendance reports.</p>
      <div className="mt-6">
        <CustomTabs
          defaultActiveKey="today"
          items={attendanceTabs}
          onChange={handleTabsChange}
        />
      </div>
    </main>
  );
}