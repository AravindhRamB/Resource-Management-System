"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import attendance from '@/assets/icons/attendance.png'
import leave from '@/assets/icons/leave.png'
import timesheet from '@/assets/icons/timesheet.png';
import reimbursement from '@/assets/icons/reimbursement.png';
import { Button, Layout, Menu, theme, ConfigProvider } from 'antd';
import livNSenselogo from "@/assets/logo/livNSenselogo.png";
import Image from "next/image";

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleMenuClick = (key: string) => {
  const routes: Record<string, string> = {
    '1': '/dasbhoard/home',
    '2': '/dasbhoard/attendance',
    '3': '/dasbhoard/timesheet',
    '4': '/dasbhoard/leave',
    '5': '/dasbhoard/reimbursement',
    '6': '/dasbhoard/approvals',
    '7': '/dasbhoard/employee',
    '8': '/dasbhoard/profile', // new route
  };
  
  if (routes[key]) {
    router.push(routes[key]);
  }
};

const getSelectedKey = () => {
  const pathMap: Record<string, string> = {
    '/dasbhoard/home': '1',
    '/dasbhoard/attendance': '2',
    '/dasbhoard/timesheet': '3',
    '/dasbhoard/leave': '4',
    '/dasbhoard/reimbursement': '5',
    '/dasbhoard/approvals': '6',
    '/dasbhoard/employee': '7',
    '/dasbhoard/profile': '8', // new mapping
  };
  return [pathMap[pathname] || '1'];
};


  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
     <Sider 
  trigger={null} 
  collapsible 
  collapsed={collapsed} 
  theme="light"
  style={{
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
  }}
>
  <div className="logo-container flex justify-center items-center my-2">
    <Image
      src={livNSenselogo}
      alt="LivNSense Logo"
      className="logo"
      width={55} 
      height={50}
      unoptimized 
    />
  </div>
  
  <ConfigProvider
    theme={{
      components: {
        Menu: {
          itemSelectedBg: '#1BA168',
          itemSelectedColor: '#ffffff',
          itemHoverColor: '#1BA168',
          itemColor: '#000000'
        },
      },
    }}
  >
    {/* Main menu section */}
    <Menu
      mode="inline"
      selectedKeys={getSelectedKey()}
      onClick={({ key }) => handleMenuClick(key)}
      items={[
        { key: '1', icon: <HomeOutlined />, label: 'Home' },
        { key: '2', icon: <ClockCircleOutlined />, label: 'Attendance' },
        { key: '3', icon: <FileTextOutlined />, label: 'Timesheet' },
        { key: '4', icon: <CalendarOutlined />, label: 'Leave' },
        { key: '5', icon: <DollarOutlined />, label: 'Reimbursement' },
        { key: '6', icon: <CheckCircleOutlined />, label: 'Approvals' },
        { key: '7', icon: <UserOutlined />, label: 'Employee' },
      ]}
    />

    {/* Profile item pinned to bottom */}
    <div style={{ marginTop: 'auto' }}>
      <Menu
        mode="inline"
        selectedKeys={getSelectedKey()}
        onClick={({ key }) => handleMenuClick(key)}
        items={[
          { key: '8', icon: <UserOutlined />, label: 'Profile' },
        ]}
      />
    </div>
  </ConfigProvider>
</Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: 'fixed',
            width: '100%',
            zIndex: 1,
            left: collapsed ? 80 : 200,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            className={`flex items-center justify-between`}
            style={{
              width: collapsed ? 1270 : 1150, // Adjust these values as needed
              transition: 'width 0.2s',
            }}
          >
             
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
          fontSize: '16px',
          width: 64,
          height: 64,
              }}
            />
           <Button type="primary" onClick={() => router.push('/auth/login')} style={{ marginRight: 16 }}>
              Logout
            </Button>
          </div>
        </Header>
        <Content
          style={{
        margin: '24px 16px',
        padding: 24,
        minHeight: 'calc(100vh - 88px)',
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        marginTop: 88, // Add margin to avoid content being hidden by the fixed header
        overflow: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};