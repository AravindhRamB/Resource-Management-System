"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for App Router
import { CustomInput } from "@/components/ui/input";
import { CustomButton } from "@/components/ui/button";
import { CustomPasswordInput } from "@/components/ui/password";
import livNSenselogo from "@/assets/logo/livNSenselogo.png"
import { CustomCheckbox } from "@/components/ui/checkbox";
import { ZodError } from "zod";
import * as z from "zod";
import { message, App as AntdApp } from "antd";
import Image from "next/image";
import { login } from "@/services/authServices"

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // State to handle loading feedback
    const router = useRouter(); // Hook to handle redirection

    const loginSchema = z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password must not exceed 20 characters")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    });

    const [formErrors, setFormErrors] = useState<string[]>([]);

    const validateForm = () => {
        console.log("Validating form with values:", { username, password });
        const result = loginSchema.safeParse({ username, password });
        if (!result.success) {
            const errors = result.error.issues.map(issue => issue.message);
            setFormErrors(errors);
            return { isValid: false, errors };
        }
        setFormErrors([]);
        console.log("Form is valid");
        return { isValid: true, errors: [] };
    };

    const handleLogin = async () => { // Make the handler async
        const { isValid, errors } = validateForm();

        if (!isValid) {
            errors.forEach(err => message.error(err));
            return;
        }
        console.log("Form is valid, proceeding with login...");
        setLoading(true); // Start loading

        try {
            const data = await login({ username, password });

            // On Success
            message.success("Login successful!");
            console.log("API Response:", data);

            // Store the token and redirect the user
            localStorage.setItem('authToken', data.token);
            router.push('/dasbhoard/home'); // Redirect to dashboard or home page

        } catch (error) {
            // On Failure
            if (error instanceof Error) {
                message.error(error.message);
            } else {
                console.log("Unexpected error:", error);
                message.error("An unexpected error occurred.");
            }
            console.error("Login Error:", error);

        } finally {
            setLoading(false); // Stop loading, regardless of outcome
        }
    };

    return (
        <AntdApp>
            <div className="login-header h-1/4">
                <Image
                    src={livNSenselogo}
                    alt="LivNSense Logo"
                    className="logo m-1.5"
                    width={55}
                    height={50}
                    unoptimized
                />
            </div>
            <div className="login-container w-96 mx-auto p-6 bg-white rounded-lg shadow-md">
                <div className="text-center mb-6">
                    <span className="!text-customgreen text-lg">Login</span>
                    <br />
                    <span className='text-black text-sm'>Welcome back to HRease</span>
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

                <div className="flex justify-between">
                    <div className="">
                        <CustomCheckbox label="Remember me" />
                    </div>
                    <div className="m-1">
                        <a href="#" className="text-customgreen hover:underline text-sm">Forgot Password?</a>
                    </div>
                </div>

                <CustomButton
                    htmlType="submit"
                    onClick={handleLogin}
                    loading={loading} // Pass loading state to the button
                >
                    {loading ? 'Logging in...' : 'Login'}
                </CustomButton>
            </div>
        </AntdApp>
    );
}