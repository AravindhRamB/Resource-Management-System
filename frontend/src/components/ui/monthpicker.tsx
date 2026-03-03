import { DatePicker } from 'antd';
import { CustomMonthPickerProps } from '@/module/formFields';

export function CustomMonthPicker({ 
  label,
  value,
  onChange,
  ...props 
}: CustomMonthPickerProps) {
  return (
    <div>
      {label && <label>{label}</label>}
      <DatePicker 
        picker="month"
        onChange={onChange}
        value={value}
        {...props}
        style={{ width: '100%' }}
      />
    </div>
  );
}