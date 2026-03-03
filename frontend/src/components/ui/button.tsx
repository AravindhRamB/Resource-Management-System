import { Button, Flex } from 'antd';
import { CustomButtonProps } from "@/module/formFields";

export function CustomButton({ customVariant = "primary", children, className, ...props }: CustomButtonProps) {
  return (
      <Flex vertical gap="small">
      <Button
        {...props}
        className={`!bg-customgreen !text-white hover:!bg-green-700 ${className ?? ''}`}
        block
      >
        {children}
      </Button>
    </Flex>
  );
}