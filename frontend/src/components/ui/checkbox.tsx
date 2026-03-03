import { CustomCheckboxProps } from "@/module/formFields";
import { Checkbox as AntInput } from 'antd';
export function CustomCheckbox({ label, ...props }: CustomCheckboxProps) {
    return (
        <div className="m-1 p-1 flex items-center">
            <AntInput ></AntInput>
            {label && <label className="mb-2 text-sm">{label}</label>}
        </div>
    );
}