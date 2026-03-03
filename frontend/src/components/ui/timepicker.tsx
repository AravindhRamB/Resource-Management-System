import { TimePicker } from 'antd';
import {CustomTimePickerProps} from "@/module/formFields";
export function Timepicker({ label, value, onChange, ...props }: CustomTimePickerProps) {
    // Adapt onChange to match AntD's expected signature
    const handleChange = (time: any, timeString: string | string[]) => {
        if (onChange) {
            // Call the original onChange with time and timeString as string
            onChange(time, Array.isArray(timeString) ? timeString[0] : timeString);
        }
    };

    return (
        <div className="m-1 p-1">
            <TimePicker value={value} {...props} onChange={handleChange} />
        </div>
    );
}