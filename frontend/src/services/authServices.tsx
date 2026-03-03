import {
  LoginCredentials,
  LoginResponse,
  JoiningFormData,
  JoiningFormResponse,
  ApiResponse,
  ApiRequestConfig,
  loginCredentialsSchema,
  joiningFormSchema,
  isApiError,
  ApiError,
  DesignationDropdownOption,
      ApplyReimbursementForm,
} from "@/module/api";
import { th } from "zod/locales";

// All other classes (ApiConfig, ApiClient) remain unchanged.
// The issue is with the AuthService class's login method.
// I've included the complete, corrected file below for clarity.

class ApiConfig {
  static get baseUrl(): string {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("API URL is not configured. Please set NEXT_PUBLIC_API_URL in your .env.local file.");
    }
    return apiUrl;
  }

  static get defaultHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  }

  static getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return {
      ...this.defaultHeaders,
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }
}

class ApiClient {
  private static async makeRequest<T>(
    endpoint: string,
    config: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = `${ApiConfig.baseUrl}${endpoint}`;

    const requestInit: RequestInit = {
      method: config.method,
      headers:
        config.requiresAuth !== false
          ? ApiConfig.getAuthHeaders()
          : ApiConfig.defaultHeaders,
      ...(config.body && { body: config.body }),
    };

    if (config.headers) {
      requestInit.headers = {
        ...requestInit.headers,
        ...config.headers,
      };
    }

    try {
      const response = await fetch(url, requestInit);
      const data = await response.json();

      if (!response.ok) {
        if (isApiError(data)) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // NOTE: This is the critical change. Instead of wrapping the response in an ApiResponse,
      // we return the raw data object directly, since your API doesn't use the 'success' and 'data' wrapper.
      return data;
    } catch (error) {
      console.error(`API request failed: ${config.method} ${endpoint}`, error);
      throw error instanceof Error ? error : new Error('Unknown API error occurred');
    }
  }

  static async post<T>(
    endpoint: string,
    body?: any,
    requiresAuth = true,
    isFormData = false
  ): Promise<T> { // <-- Changed return type to T
    const headers = isFormData ? {} : undefined;
    
    // This return type is what is causing the error.
    const response = await this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
      requiresAuth,
      headers,
    });
    // The code below is a better way to handle the API response format.
    // Since the API response for login does not match the ApiResponse type,
    // we need to check if the response has a 'success' property.
    if (isApiError(response as ApiResponse<T>)) {
      throw new Error((response as ApiError).message);
    }
    return response as T;
  }

  static async get<T>(
    endpoint: string,
    requiresAuth = true
  ): Promise<T> { // <-- Changed return type to T
    const response = await this.makeRequest<T>(endpoint, {
      method: 'GET',
      requiresAuth,
    });
    if (isApiError(response as ApiResponse<T>)) {
      throw new Error((response as ApiError).message);
    }
    return response as T;
  }
}


export class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const validatedCredentials = loginCredentialsSchema.parse(credentials);
    
    const response = await ApiClient.post<LoginResponse>(
      '/auth/login',
      validatedCredentials,
      false
    );

    // Now the response is the direct data from the API call.
    // No need to check for isApiError or response.data.
    if (!response || !response.token) {
      throw new Error("Login response is invalid or missing token.");
    }

    if (typeof window !== 'undefined' && response.token) {
      localStorage.setItem('authToken', response.token);
    }

    return response;
  }
 
  // Rest of the AuthService class remains unchanged.
  static async logout(): Promise<void> {
    try {
      await ApiClient.post<void>('/auth/logout', {});
    } catch (error) {
      console.warn('Logout API call failed, continuing with local logout:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    }
  }

  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('authToken');
    return !!token;
  }
}


export class EmployeeService {
//   static async submitJoiningForm(
//     jsonData: Omit<JoiningFormData, 'files'>, 
//     files: Record<string, FileList | undefined> 
//   ): Promise<JoiningFormResponse> {
    
//     const submitData = new FormData();

//     submitData.append('data', JSON.stringify(jsonData));

//     Object.entries(files).forEach(([key, fileList]) => {
//       if (fileList) {
//         Array.from(fileList).forEach((file) => {
//           submitData.append(key, file);
//         });
//       }
//     });

//     const response = await ApiClient.post<JoiningFormResponse>(
//       '/employee/joining-form',
//       submitData,
//       true, 
//       true  
//     );

//     if (isApiError(response)) {
//       throw new Error(response.message);
//     }

//     return response.data;
//   }


// just for testing without files
    static async submitJoiningForm(
        jsonData: Omit<JoiningFormData, 'files'> 
    ): Promise<JoiningFormResponse> {
        
        const validatedData = joiningFormSchema.parse(jsonData);
        console.log("Validated Data:", validatedData);
    
        const response = await ApiClient.post<JoiningFormResponse>(
        '/add_employee',
        validatedData,
        true  
        );
    
        // No need to check isApiError or response.data, since response is the direct data.
        return response;
    }

 static async getDesignationList(): Promise<DesignationDropdownOption[]> {
        
        const response = await ApiClient.get<DesignationDropdownOption[]>(
            '/role_list',
            true 
        );

        return response;
    }
    static async onBoardEmployee(formData: {
        username: string;   
        email: string;
        emp_id: string;
        designation: string | number;
    }): Promise<ApiResponse> {
        const response = await ApiClient.post<ApiResponse>(
            '/createUser',
            formData,
            true 
        );

        if (isApiError(response)) {
            throw new Error(response.message);
        }

        return response;
    }
}

export class ReimbursementService {
    static async getProjectList(): Promise<DesignationDropdownOption[]> {
        const response = await ApiClient.get<DesignationDropdownOption[]>(
            '/project_list',
            true
        );
        return response;
    }
    static async getCategoryList(): Promise<DesignationDropdownOption[]> {
        const response = await ApiClient.get<DesignationDropdownOption[]>(
            '/category_list',
            true
        );
        return response;
    }
    static async applyReimbursement(formData: ApplyReimbursementForm): Promise<ApiResponse> {
        const response = await ApiClient.post<ApiResponse>(
            '/apply_reimbursement',
            formData,
            true
        );

        if (isApiError(response)) {
            throw new Error(response.message);
        }

        return response;
    }
}



export const login = AuthService.login;
export const logout = AuthService.logout;
export const isAuthenticated = AuthService.isAuthenticated;
export const submitJoiningForm = EmployeeService.submitJoiningForm;
export const getDesignationList = EmployeeService.getDesignationList;
export const onBoardEmployee = EmployeeService.onBoardEmployee;
export const getProjectList = ReimbursementService.getProjectList;
export const getCategoryList = ReimbursementService.getCategoryList;
export const applyReimbursement = ReimbursementService.applyReimbursement;