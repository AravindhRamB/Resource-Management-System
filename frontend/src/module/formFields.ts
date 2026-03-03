

import { InputProps as AntdInputProps } from "antd/es/input";
import { ButtonProps as AntdButtonProps } from "antd"; // Correct import
import { CheckboxProps as AntdCheckboxProps } from "antd"; // For checkbox
import { TextAreaProps as AntdTextAreaProps } from "antd/es/input"; // For textarea
// import { SelectProps as AntdSelectProps } from "antd/es/select"; // For select
import { DatePickerProps as AntdDatePickerProps } from "antd/es/date-picker"; // For date picker
import { RangePickerProps } from 'antd/es/date-picker';
// import { RadioGroupProps as AntdRadioGroupProps } from "antd/es/radio"; // For radio group
import { DatePickerProps } from 'antd/es/date-picker';
import { Dayjs } from 'dayjs';



export interface CustomInputProps extends AntdInputProps {
  label?: string;
}
// export interface CustomRadioGroupProps extends AntdRadioGroupProps {
//   options: { value: string; label: string }[];
//   value?: string;
//   className?: string;
// }

export interface CustomPasswordInputProps extends AntdInputProps {
  label?: string;
  placeholder?: string;
}

export interface CustomButtonProps extends AntdButtonProps {
  customVariant?: "primary" | "secondary";
}

export interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  label?: string;
}

export interface CustomTextareaProps extends AntdTextAreaProps {
  label?: string;
}


export interface CustomCheckboxProps extends AntdCheckboxProps {
  label?: string;
}

// export interface CustomRadioGroupProps {
//   name: string;
//   options: { value: string; label: string }[];
//   onChange?: (value: string) => void;
// }


export interface CustomDatepickerProps extends AntdDatePickerProps {
  label?: string;
}
export interface CustomRangePickerProps extends RangePickerProps {
  label?: string;
  // RangePickerProps already includes these types:
  value?: [Dayjs | null, Dayjs | null] | null;
  onChange?: (dates: [Dayjs | null, Dayjs | null] | null, dateStrings: [string, string]) => void;
}
export interface CustomMonthPickerProps extends DatePickerProps {
  label?: string;
  // DatePickerProps already includes:
  // value?: Dayjs | null;
  // onChange?: (date: Dayjs | null, dateString: string) => void;
}
export interface CustomTimePickerProps {
  label?: string;
  value?: Dayjs | null;
  format?: string; // e.g., 'HH:mm:ss'
  onChange?: (time: Dayjs | null, timeString: string) => void;
}

// export interface CustomDropdownProps {
//   options: { value: string; label: string }[];
//   label?: string;
//   onChange?: (value: string) => void;
//   value?: string;
//   placeholder?: string;
//   disabled?: boolean;
//   className?: string;
// }
export interface CustomDropdownProps {
  options: { value: string | number; label: string }[];
  label?: string;
  onChange?: (value: string | number) => void;
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}