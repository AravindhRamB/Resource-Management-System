"use client"
import { Card } from 'antd';
import attendance from '@/assets/icons/attendance.png'
import leave from '@/assets/icons/leave.png'
import timesheet from '@/assets/icons/timesheet.png';
import reimbursement from '@/assets/icons/reimbursement.png';
import cake from '@/assets/icons/cake.png';
import popper from '@/assets/icons/popper.png';
import notification from '@/assets/icons/notification.png';
import { useRouter } from 'next/navigation';

import { CustomCard } from '@/components/ui/card';

export default function HomePage() {
    // Define the data for the cards, making it dynamic
    const router = useRouter();
    const cardData = [
        {
            title: 'Happy Birthday',
            description: 'Adhya S Bhat',
            icon: <img src={cake.src} alt="Birthday Icon" style={{ width: '32px', height: '32px' }} />,
            isClickable: false,
        },
        {
            title: 'Happy Work Anniversary',
            description: 'Adhya S Bhat',
            icon: <img src={popper.src} alt="Anniversary Icon" style={{ width: '32px', height: '32px' }} />,
            isClickable: false,
        },
        {
            title: 'Attendance',
            description: 'View attendance records.',
            icon: <img src={attendance.src} alt="Attendance Icon" style={{ width: '32px', height: '32px' }} />,
            isClickable: true,
            onClick: () => router.push('/dasbhoard/attendance'),
        },
        {
            title: 'Alert - Notification',
            description: 'Check back tomorrow!',
            icon: <img src={notification.src} alt="Notification Icon" style={{ width: '32px', height: '32px' }} />,
            isClickable: false,
        },
        {
            title: 'Time Sheet',
            description: 'Manage your work hours.',
            icon: <img src={timesheet.src} alt="Timesheet Icon" style={{ width: '32px', height: '32px' }} />,
            isClickable: true,
            onClick: () => router.push('/dasbhoard/timesheet'),
        },
        {
            title: 'Leave',
            description: 'Request and track leave.',
            icon: <img src={leave.src} alt="Leave Icon" style={{ width: '32px', height: '32px' }} />,
            isClickable: true,
            onClick: () => router.push('/dasbhoard/leave'),
        },
        {
            title: 'Reimbursement',
            description: 'Submit expense reports.',
            icon: <img src={reimbursement.src} alt="Reimbursement Icon" style={{ width: '32px', height: '32px' }} />,
            isClickable: true,
            onClick: () => router.push('/dasbhoard/reimbursement'),
        },
    ];

    return (
        <div className="h-screen overflow-y-auto bg-gray-50">
            <div className="p-6">
                {/* Header Section */}
                <div className="mb-8">
                    {/* <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1> */}
                    <div className="text-lg font-mono text-customgreen bg-white px-4 py-2 rounded-lg shadow-sm inline-block">
                        03:21:23
                    </div>
                </div>

                {/* Cards Grid - Dynamic sizing with proper spacing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {cardData.map((card, index) => (
                        <div
                            key={index}
                            className="h-36 w-full max-w-sm mx-auto"
                        >
                            <CustomCard
                                title={card.title}
                                description={card.description}
                                icon={card.icon}
                                isClickable={card.isClickable}
                                onClick={card.onClick}
                                className="shadow-md hover:shadow-lg"
                            />
                        </div>
                    ))}
                </div>

                {/* Additional Content Area */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
          <Card className="shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Present Today:</span>
                <span className="font-semibold text-green-600">245</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">On Leave:</span>
                <span className="font-semibold text-orange-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Approvals:</span>
                <span className="font-semibold text-red-600">5</span>
              </div>
            </div>
          </Card>

          <Card className="shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-600 text-sm">John Doe submitted leave request</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-600 text-sm">Timesheet approved for last week</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-600 text-sm">New expense report submitted</span>
              </div>
            </div>
          </Card>
        </div> */}

                {/* Extra content to demonstrate scrolling */}
                {/* <div className="mt-8">
          <Card className="shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
            <div className="space-y-4">
              <p className="text-gray-600">This is additional content to demonstrate that only the dashboard content scrolls while the sidebar remains fixed.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Announcements</h4>
                  <p className="text-blue-700 text-sm">No new announcements today.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Upcoming Events</h4>
                  <p className="text-green-700 text-sm">Team meeting scheduled for tomorrow.</p>
                </div>
              </div>
            </div>
          </Card>
        </div> */}
            </div>
        </div>
    );
}