'use client';

import React from 'react';
import { Tabs, TabsProps } from 'antd';

export function CustomTabs(props: TabsProps) {
  // This is a simple wrapper component that forwards all props
  // to the Ant Design Tabs component.
  return <Tabs {...props} />;
}