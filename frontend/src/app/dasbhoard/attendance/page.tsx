'use client';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import DynamicTable from '@/components/ui/table';
import { Datepicker } from '@/components/ui/daterangepicker';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

type Attendance = {
    date: Dayjs;
    loginTime: string;
    logoutTime: string;
    totalHrs: string;
    remark: string;
};

const attendanceData: Attendance[] = [
    { date: dayjs('02/01/2025', 'DD/MM/YYYY'), loginTime: '09:00 AM', logoutTime: '06:00 PM', totalHrs: '9:00', remark: 'Present' },
    { date: dayjs('03/01/2025', 'DD/MM/YYYY'), loginTime: '09:30 AM', logoutTime: '05:30 PM', totalHrs: '8:00', remark: 'Less than 9 hrs' },
    { date: dayjs('04/01/2025', 'DD/MM/YYYY'), loginTime: '08:45 AM', logoutTime: '06:30 PM', totalHrs: '9:45', remark: 'More than 9 hrs' },
    { date: dayjs('05/01/2025', 'DD/MM/YYYY'), loginTime: '', logoutTime: '', totalHrs: '', remark: 'Leave' },
    { date: dayjs('06/01/2025', 'DD/MM/YYYY'), loginTime: '', logoutTime: '', totalHrs: '', remark: 'Holiday' },
    { date: dayjs('07/01/2025', 'DD/MM/YYYY'), loginTime: '09:15 AM', logoutTime: '06:00 PM', totalHrs: '8:45', remark: 'Present' },
    { date: dayjs('08/01/2025', 'DD/MM/YYYY'), loginTime: '09:00 AM', logoutTime: '06:00 PM', totalHrs: '9:00', remark: 'Present' },
    { date: dayjs('09/01/2025', 'DD/MM/YYYY'), loginTime: '09:05 AM', logoutTime: '06:05 PM', totalHrs: '9:00', remark: 'Present' },
    { date: dayjs('10/01/2025', 'DD/MM/YYYY'), loginTime: '09:00 AM', logoutTime: '06:00 PM', totalHrs: '9:00', remark: 'Present' },
    { date: dayjs('11/01/2025', 'DD/MM/YYYY'), loginTime: '09:00 AM', logoutTime: '06:00 PM', totalHrs: '9:00', remark: 'Present' },
];

export default function AttendancePage() {
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

    // Filter data based on date range
    const filteredData = attendanceData.filter((row) => {
        if (!dateRange[0] || !dateRange[1]) return true;
        return row.date.isSameOrAfter(dateRange[0], 'day') && row.date.isSameOrBefore(dateRange[1], 'day');
    });
    const formattedData = filteredData.map(row => ({
    ...row,
    date: row.date.format('DD/MM/YYYY'),
}));


    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold">Attendance</h1>
            <div>
                <Datepicker
                    label="Select Date Range"
                    value={dateRange}
                    onChange={(dates: [Dayjs | null, Dayjs | null] | null) => setDateRange(dates ?? [null, null])}
                />
            </div>
            <div className="mt-6">
                <DynamicTable
                    data={formattedData}
                    loading={false}
                    pagination={{ pageSize: 5, }}
                    size="middle"
                    scroll={{ x: 800 }}
                />
            </div>
        </main>
    );
}
