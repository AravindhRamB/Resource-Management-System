// src/app/layout.tsx

"use client";

import React from 'react';
import 'antd/dist/reset.css';
import { App, ConfigProvider, message } from 'antd';
import './global.css';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <html lang="en">
      <body>
        {/* 2. Wrap everything with the new StyleProvider */}
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1BA168',
              },
            }}
          >
            <App>
              {contextHolder}
              {children}
            </App>
          </ConfigProvider>
      </body>
    </html>
  );
};

export default RootLayout;