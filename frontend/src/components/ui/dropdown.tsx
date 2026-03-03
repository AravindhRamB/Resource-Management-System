import { CustomDropdownProps } from "@/module/formFields";
import { Dropdown, Button, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";

export function CustomDropdown({ options=[], label, onChange, value, placeholder, disabled, className }: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(option => option.value === value);
    const displayText = selectedOption ? selectedOption.label : (placeholder || "Select an option");

    // Menu for dropdown
    const menu = (
        <Menu
            selectedKeys={value ? [String(value)] : []} // ✅ must be string[]
            onClick={({ key }) => {
                const parsedKey = isNaN(Number(key)) ? key : Number(key);
                onChange?.(parsedKey);
                setIsOpen(false);
            }}
        >
            {options.map(option => (
                <Menu.Item key={String(option.value)}>
                    {option.label}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <div className={`m-1 ${className}`}>
            {label && (
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <Dropdown
                overlay={menu}
                disabled={disabled}
                onOpenChange={setIsOpen}
                trigger={['click']}
                placement="bottomLeft"
            >
                <Button 
                    className="w-full flex justify-start items-center"
                    style={{ 
                        color: selectedOption ? 'inherit' : '#9CA3AF',
                        border: '1px solid #D1D5DB',
                        height: '35px'
                    }}
                >
                    <span>{displayText}</span>
                    <DownOutlined style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                    }} />
                </Button>
            </Dropdown>
        </div>
    );
}
