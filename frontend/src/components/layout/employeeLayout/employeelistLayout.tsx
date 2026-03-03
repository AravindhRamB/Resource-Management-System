'use client';
import { CustomInput } from '@/components/ui/input';
import DynamicTable from '@/components/ui/table';

function formatDate(date: Date) {
    return date
        ? `${date.getDate().toString().padStart(2, '0')}/${
            (date.getMonth() + 1).toString().padStart(2, '0')
        }/${date.getFullYear()}`
        : '';
}

export function EmployeeListLayout() {
    // Sample employee data
    const employeeData = [
        {
            id: 1,
            name: 'Adhya S Bhat',
            designation: 'UI Developer',
            joiningDate: new Date('2023-01-15'),
        },
        {
            id: 2,
            name: 'Rakesh',
            designation: 'Senior UI Developer',
            joiningDate: new Date('2023-02-20'),
        },
        {
            id: 3,
            name: 'Aravindh Ram',
            designation: 'API Developer',
            joiningDate: new Date('2023-02-20'),
        },
        {
            id: 4,
            name: 'Aariz',
            designation: 'AI/ML Engineer',
            joiningDate: new Date('2022-11-10'),
        }
    ];

    // Format joiningDate for display
    const formattedData = employeeData.map(emp => ({
        ...emp,
        joiningDate: formatDate(emp.joiningDate),
    }));

    return (
        <div className="employee-list-layout">
            <div className="employee-content">
                <DynamicTable
                    data={formattedData}
                    loading={false}
                    pagination={{
                        pageSize: 10,
                        
                    }}
                    scroll={{ x: 800 }}
                />
            </div>
        </div>
    );
}