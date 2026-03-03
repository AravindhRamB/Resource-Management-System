import { CustomTextareaProps } from "@/module/formFields";
import {Input} from "antd";
const { TextArea } = Input;
export function Textarea({ label, ...props }: CustomTextareaProps) {
    return (
       <TextArea rows={5} />
    );
}