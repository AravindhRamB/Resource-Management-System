import { join } from "path";
import { z } from "zod";

// Define the schema for login credentials
export const loginCredentialsSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

// Define the expected successful response for login
export interface LoginResponse {
    token: string;
    user: {
        id: string;
        username: string;
        email?: string;
        role?: string;
    };
    message?: string;
}

// Define the schema for a single education entry
const educationDetailSchema = z.object({
    education_level: z.string().optional(),
    instituation_name: z.string().optional(),
    degree: z.string().optional(),
    course_start_date: z.string().optional(),
    course_end_date: z.string().optional(),
    specialization: z.string().optional(),
    percentage: z.string().optional(),
});

// Define the schema for a single employment entry
const previousEmploymentSchema = z.object({
    prev_employer_name: z.string().optional(),
    prev_emp_id: z.string().optional(),
    periodFrom: z.string().optional(),
    periodTo: z.string().optional(),
    designation: z.string().optional(),
    prev_salary_drawn: z.string().optional(),
    duty_description: z.string().optional(),
});

// Define the full joining form schema
export const joiningFormSchema = z.object({
    // Personal Information
    salutation: z.string().min(1, "Please select a salutation"),
    first_name: z.string().min(1, "First name is required"),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, "Last name is required"),
    father_name: z.string().min(1, "Father's name is required"),
    mother_name: z.string().optional(),
    date_of_birth: z.string().min(1, "Date of birth is required"),
    place_of_birth: z.string().optional(),
    nationality: z.string().min(1, "Nationality is required"),
    marital_status: z.string().min(1, "Marital status is required"),
    email: z.string().email("Invalid email address"),
    gender: z.string().min(1, "Gender is required"),
    phone: z.string().min(1, "Phone number is required"),
    present_address: z.string().min(1, "Present address is required"),
    permanent_address: z.string().min(1, "Permanent address is required"),
    present_address_pincode: z.string().optional(),
    permanentaddressPinCode: z.string().optional(),
    educationDetails: z.array(educationDetailSchema).optional(),
    previousEmployments: z.array(previousEmploymentSchema).optional(),
    // Passport Information
    passport_no: z.string().optional(),
    passport_issue_date: z.string().optional(),
    passport_issue_place: z.string().optional(),
    passport_expiry_date: z.string().optional(),
    appliedForPassport: z.string().optional(),
    // Bank Details
    acc_number: z.string().min(1, "Account number is required"),
    ifsc_code: z.string().min(1, "IFSC code is required"),
    bank_name: z.string().min(1, "Bank name is required"),
    branch: z.string().min(1, "Bank branch is required"),
    // Employment Status
    employmentStatus: z.string().optional(),
    date_of_join: z.string().min(1, "Joining date is required"),
    declaration: z.boolean().refine(val => val === true, "You must accept the declaration"),
});

// The type for the joining form data, including optional file lists
export type JoiningFormData = z.infer<typeof joiningFormSchema> & {
    // Files are commented out as per the current AuthService implementation.
    // sscMarksCard?: FileList;
    // hscMarksCard?: FileList;
    // degreeCertificate?: FileList;
    // aadharCard?: FileList;
    // panCard?: FileList;
    // bankDetailsAttachment?: FileList;
    // resume?: FileList;
    // experienceLetter?: FileList;
    // lastThreeMonthsPaySlip?: FileList;
};

// The response type for the joining form submission
export interface JoiningFormResponse {
    success: boolean;
    message: string;
    applicationId?: string;
    data?: {
        id: string;
        status: string;
        submittedAt: string;
        [key: string]: any;
    };
}

// Interface for API errors
export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
    code?: string;
    timestamp?: string;
}

export interface DesignationDropdownOption {
    label: string;
    value: number;
}
// Interface for successful API responses
export interface ApiSuccess<T = any> {
    success: true;
    message?: string;
    data: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

// A union type representing a successful or erroneous API response
export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

// Configuration for making an API request
export interface ApiRequestConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: string | FormData;
    requiresAuth?: boolean;
}

// Utility function to check if a response is an API error
export const isApiError = <T>(response: ApiResponse<T>): response is ApiError => {
    return response.success === false;
};
export interface ExpenseItem {
    bill_raised_date: string | null; // or Date if you want to store as Date object
    bill_date: string | null;
    paid_to: string;
    category: string;
    vendor: string;
    currency: 'INR' | 'USD';
    advance_paid: string | number;
    bill_attachment: File | null;
}

export interface ApplyReimbursementForm {
    project: string;
    claim_number: string;
    place_of_visit: string;
    expenses: ExpenseItem[];
}
