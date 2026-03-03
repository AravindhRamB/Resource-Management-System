import { CustomRangePickerProps } from "@/module/formFields";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

export function Datepicker({ label, value, onChange, ...props }: CustomRangePickerProps) {
    return (
        <div className="m-1 p-1">
            <RangePicker value={value} onChange={onChange} {...props} />
        </div>
    );
}