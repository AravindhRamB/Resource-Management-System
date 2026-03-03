"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for App Router
import { CustomInput } from "@/components/ui/input";
import { CustomButton } from "@/components/ui/button";
import { CustomPasswordInput } from "@/components/ui/password";
import livNSenselogo from "@/assets/logo/livNSenselogo.png"
import * as z from "zod";
import { message, App as AntdApp } from "antd";
import Image from "next/image";
export default function ResetPasswordPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false); // State to handle loading feedback
    const router = useRouter(); // Hook to handle redirection
    const resetPasswordSchema = z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password must not exceed 20 characters")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
        confirmpassword: z.string().min(1, "Confirm Password is required")
    });
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const validateForm = () => {
        console.log("Validating form with values:",
            { username, password, confirmpassword });
        const result = resetPasswordSchema.safeParse({ username, password, confirmpassword });  
        if (!result.success) {
            const errors = result.error.issues.map(issue => issue.message);
            setFormErrors(errors);
            return { isValid: false, errors };
        }
        setFormErrors([]);
        console.log("Form is valid");
        return { isValid: true, errors: [] };
    }
    const handlereset = async () => { // Make the handler async
        const { isValid, errors } = validateForm();
        if (!isValid) {
            errors.forEach(err => message.error(err));
            return;
        }
        console.log("Form is valid, proceeding with reset...");
        setLoading(true); // Start loading
        try {
            // Simulate API call for password reset
            // Replace this with your actual API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            message.success("Password changed successfully");
            router.push('/auth/login'); // Redirect to login page after successful reset
        } catch (error) {
            console.error("Error resetting password:", error);
            message.error("Failed to change password");
        } finally {
            setLoading(false); // Stop loading
        }
    };
    return (
        <AntdApp>
            <div className="resetpassword-header h-1/4">
            <Image
                src={livNSenselogo}
                alt="LivNSense Logo"
                className="logo m-1.5"
                width={55}
                height={50}
                />
                </div>
            <div className="resetpassword-form w-96 mx-auto p-6 bg-white rounded-lg shadow-md">
                <div className="text-center mb-6">
                    <span className="!text-center mb-6">Reset Password</span>
                    <br />
                    <span className='text-black text-sm'>You can reset your password here</span>
                </div>
                   <CustomInput
                    label="Username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <CustomPasswordInput
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <CustomPasswordInput
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={confirmpassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <CustomButton
                    htmlType="submit"
                    onClick={handlereset}
                    loading={loading} // Pass loading state to the button
                >
                    {loading ? 'Changing Password' : 'Reset Password'}
                </CustomButton>
            </div>
            </AntdApp>
    );
}