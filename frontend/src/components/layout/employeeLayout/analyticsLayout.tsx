import VerticalBarChart from "@/components/ui/barchart";
import { useState } from 'react';
import { CustomDropdown } from "@/components/ui/dropdown";
export function AnalyticsLayout() {
 
const [selectedPeriod, setSelectedPeriod] = useState<string>('Monthly');
    
    const employeeTypeData = [
        { name: 'Full-Time', value: 120 },
        { name: 'Contract', value: 50 },
        { name: 'Intern', value: 30 },
    ];
    
    const departmentData = [
        { name: 'Engineering', value: 200 },
        { name: 'Marketing', value: 150 },
        { name: 'Sales', value: 100 },
        { name: 'HR', value: 80 },
    ];
    
    const sexData = [
        { name: 'Female', value: 180 },
        { name: 'Male', value: 220 },
    ];

    // Sample data that could change based on selected period
    const getMetrics = (period: string) => {
        const multiplier = period === 'Monthly' ? 1 : period === 'quaterlly' ? 3 : 12;
        return {
            totalEmployees: 350 * multiplier,
            newHires: 25 * multiplier,
            activeProjects: 15 * multiplier,
        };
    };

    const metrics = getMetrics(selectedPeriod);
    return (
        <div className="analytics-layout">
            <div>

            </div>
            <div className="flex justify-end items-center mb-4">
                <span className="mr-2 text-sm font-medium">Select Department</span>
                {/* <CustomDropdown
                            options={[
                                { value: 'Monthly', label: 'Monthly' },
                                { value: 'quaterlly', label: 'Quarterly' },
                                { value: 'yearly', label: 'Yearly' },
                            ]}
                            value={selectedPeriod}
                            onChange={(value: string) => {
                                console.log('Selected Period:', value);
                                setSelectedPeriod(value);
                            }}
                            placeholder="Select period"
                        /> */}
            </div>
            <div className="analytics-content flex-col gap-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <h2 className="text-base font-medium mb-2">Employee Types</h2>
                    <div className="analytics-card shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]">
                        <VerticalBarChart
                            data={employeeTypeData}
                            barColor="#82ca9d"
                        />
                    </div>
                    </div>
                    <div>
                        <h2 className="text-base font-medium mb-2">Departments</h2>
                    <div className="analytics-card shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]">
                        <VerticalBarChart
                            data={departmentData}
                            barColor="#82ca9d"
                        />
                    </div>
                    </div>
                    <div>
                    <h2 className="text-base font-medium mb-2">Gender</h2>
                    <div className="analytics-card shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]">
                        <VerticalBarChart
                            data={sexData}
                            barColor="#82ca9d"
                            />
                      </div>      
                    </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]
 h-20 rounded-2xl p-4 items-center justify-between">
                    <h2 className="text-base font-medium mb-2">Total No. Of Employee</h2>
                    <div className="text-2xl font-bold text-customgreen">350</div>
                </div>
                <div className="flex shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]
 h-20 rounded-2xl p-4 items-center justify-between">
                    <h2 className="text-base font-medium mb-2">Total No. Of Employee</h2>
                    <div className="text-2xl font-bold text-customgreen">10</div>
                </div>
                <div className="flex shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]
 h-20 rounded-2xl p-4 items-center justify-between">
                    <h2 className="text-base font-medium mb-2">Total No. Of Employee</h2>
                    <div className="text-2xl font-bold text-customgreen">2</div>
                </div>
            </div>
            </div>
        </div>
    );
}