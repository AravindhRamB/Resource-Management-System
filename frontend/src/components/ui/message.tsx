import { Button, message, Space } from 'antd';

export function CustomMessage({ content, type = "info", duration = 3 }: { content: string; type?: "success" | "error" | "info"; duration?: number }) {
    return (
        <Space>

            <Button >Error</Button>
        </Space>
    );
}