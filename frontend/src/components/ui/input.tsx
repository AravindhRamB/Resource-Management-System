// components/ui/CustomInput.tsx
import { CustomInputProps } from "@/module/formFields";
import { Input as AntdInput } from "antd";
import { UserOutlined } from "@ant-design/icons";

export function CustomInput({ label, placeholder, ...props }: CustomInputProps) {
  return (
    <div className="m-1 p-1">
      {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
      <AntdInput {...props} placeholder={placeholder} prefix={<UserOutlined />} />
    </div>
  );
}
