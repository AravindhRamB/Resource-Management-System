import React from 'react';
import { CustomPasswordInputProps } from "@/module/formFields";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input } from 'antd';

export function CustomPasswordInput({ label, placeholder, value, onChange }: CustomPasswordInputProps) {
    return (
        <div className="m-1 p-1">
            {label && <label className="mb-2 text-sm">{label}</label>}
            <Input.Password
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
        </div>
    );
}
