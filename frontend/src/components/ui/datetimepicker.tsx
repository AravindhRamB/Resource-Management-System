import React from 'react';
import { DatePicker, Space } from 'antd';
import { CustomRangePickerProps } from '@/module/formFields';

const { RangePicker } = DatePicker;

export function CustomDateTimePicker({ 
  value, 
  ...props 
}: CustomRangePickerProps) {
  return (
    <Space direction="vertical" size={12}>
      <RangePicker 
        showTime
        {...props}
        value={value}
        style={{ width: '100%' }}
      />
    </Space>
  );
}