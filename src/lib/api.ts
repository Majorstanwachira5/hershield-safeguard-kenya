import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 30000, // 30 seconds timeout
  withCredentials: true, // Include cookies for authentication
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token from localStorage if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Remove invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    
    // Log error for monitoring
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      method: error.config?.method,
    });
    
    return Promise.reject(error);
  }
);

// API response type
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Authentication API
export const authAPI = {
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    location?: {
      county?: string;
      city?: string;
    };
  }) => api.post<ApiResponse>('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post<ApiResponse>('/auth/login', credentials),
  
  logout: () => api.post<ApiResponse>('/auth/logout'),
  
  getMe: () => api.get<ApiResponse>('/auth/me'),
  
  updateProfile: (profileData: any) =>
    api.put<ApiResponse>('/auth/profile', profileData),
  
  updatePassword: (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => api.put<ApiResponse>('/auth/password', passwordData),
  
  forgotPassword: (email: string) =>
    api.post<ApiResponse>('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, newPassword: string) =>
    api.put<ApiResponse>(`/auth/reset-password/${token}`, { newPassword }),
  
  verifyEmail: (token: string) =>
    api.get<ApiResponse>(`/auth/verify-email/${token}`),
  
  resendVerification: () =>
    api.post<ApiResponse>('/auth/resend-verification'),
};

// AI API
export const aiAPI = {
  analyzeMessage: (messageData: {
    message: string;
    sender?: string;
    context?: string;
  }) => api.post<ApiResponse>('/ai/analyze-message', messageData),
  
  detectThreat: (content: string) =>
    api.post<ApiResponse>('/ai/detect-threat', { content }),
  
  moderateContent: (content: string) =>
    api.post<ApiResponse>('/ai/moderate-content', { content }),
  
  checkHarassment: (content: string) =>
    api.post<ApiResponse>('/ai/check-harassment', { content }),
  
  analyzeSentiment: (content: string) =>
    api.post<ApiResponse>('/ai/analyze-sentiment', { content }),
  
  getSafetyAdvice: (situationData: {
    situation: string;
    category?: string;
  }) => api.post<ApiResponse>('/ai/safety-advice', situationData),
  
  assessRisk: (riskData: {
    factors: string[];
    location?: string;
    timeOfDay?: string;
  }) => api.post<ApiResponse>('/ai/assess-risk', riskData),
  
  generateEmergencyResponse: (emergencyData: {
    emergencyType: string;
    location?: string;
    immediateHelp?: boolean;
    details?: string;
  }) => api.post<ApiResponse>('/ai/emergency-response', emergencyData),
};

// Safety API
export const safetyAPI = {
  getDashboard: () => api.get<ApiResponse>('/safety/dashboard'),
  
  getMetrics: () => api.get<ApiResponse>('/safety/metrics'),
  
  getThreatReports: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    riskLevel?: string;
    threatType?: string;
  }) => api.get<ApiResponse>('/safety/reports', { params }),
  
  getThreatReport: (reportId: string) =>
    api.get<ApiResponse>(`/safety/reports/${reportId}`),
  
  updateThreatReportStatus: (
    reportId: string,
    statusData: {
      status: string;
      reviewNotes?: string;
      actionTaken?: string;
      resolutionType?: string;
    }
  ) => api.put<ApiResponse>(`/safety/reports/${reportId}/status`, statusData),
  
  getSafetyTips: (params?: {
    category?: string;
    isActive?: boolean;
  }) => api.get<ApiResponse>('/safety/tips', { params }),
  
  createSafetyTip: (tipData: {
    title: string;
    content: string;
    category: string;
    priority?: number;
    tags?: string[];
  }) => api.post<ApiResponse>('/safety/tips', tipData),
};

// Emergency API
export const emergencyAPI = {
  triggerAlert: (alertData: {
    emergencyType: string;
    location?: string;
    message?: string;
    severity?: string;
    contacts?: string[];
  }) => api.post<ApiResponse>('/emergency/alert', alertData),
  
  reportEmergency: (reportData: {
    description: string;
    emergencyType: string;
    location?: string;
    severity: string;
    isOngoing?: boolean;
    evidenceUrls?: string[];
  }) => api.post<ApiResponse>('/emergency/report', reportData),
  
  sendSafetyCheckIn: (checkInData: {
    status: string;
    location?: string;
    message?: string;
    coordinates?: number[];
  }) => api.post<ApiResponse>('/emergency/check-in', checkInData),
  
  getEmergencyContacts: () => api.get<ApiResponse>('/emergency/contacts'),
  
  addEmergencyContact: (contactData: {
    name: string;
    phoneNumber: string;
    relationship: string;
    isPrimary?: boolean;
    canReceiveAlerts?: boolean;
  }) => api.post<ApiResponse>('/emergency/contacts', contactData),
  
  updateEmergencyContact: (contactId: string, contactData: any) =>
    api.put<ApiResponse>(`/emergency/contacts/${contactId}`, contactData),
  
  deleteEmergencyContact: (contactId: string) =>
    api.delete<ApiResponse>(`/emergency/contacts/${contactId}`),
  
  getEmergencyHistory: () => api.get<ApiResponse>('/emergency/history'),
  
  getLocalResources: () => api.get<ApiResponse>('/emergency/resources'),
};

// Reports API
export const reportsAPI = {
  createReport: (reportData: {
    title: string;
    description: string;
    category: string;
    priority?: string;
    isAnonymous?: boolean;
    location?: string;
    evidenceUrls?: string[];
    tags?: string[];
  }) => api.post<ApiResponse>('/reports', reportData),
  
  getReports: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    priority?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    search?: string;
  }) => api.get<ApiResponse>('/reports', { params }),
  
  getReport: (reportId: string) =>
    api.get<ApiResponse>(`/reports/${reportId}`),
  
  updateReport: (reportId: string, reportData: any) =>
    api.put<ApiResponse>(`/reports/${reportId}`, reportData),
  
  deleteReport: (reportId: string) =>
    api.delete<ApiResponse>(`/reports/${reportId}`),
  
  getReportStats: (params?: {
    fromDate?: string;
    toDate?: string;
    groupBy?: string;
  }) => api.get<ApiResponse>('/reports/stats/overview', { params }),
};

// Resources API
export const resourcesAPI = {
  getResources: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    county?: string;
    city?: string;
    cost?: string;
    isEmergency?: boolean;
    language?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => api.get<ApiResponse>('/resources', { params }),
  
  searchResources: (params: {
    q: string;
    limit?: number;
    category?: string;
    location?: string;
  }) => api.get<ApiResponse>('/resources/search', { params }),
  
  getResource: (resourceId: string) =>
    api.get<ApiResponse>(`/resources/${resourceId}`),
  
  createResource: (resourceData: any) =>
    api.post<ApiResponse>('/resources', resourceData),
  
  updateResource: (resourceId: string, resourceData: any) =>
    api.put<ApiResponse>(`/resources/${resourceId}`, resourceData),
  
  deleteResource: (resourceId: string) =>
    api.delete<ApiResponse>(`/resources/${resourceId}`),
};

// Users API
export const usersAPI = {
  getUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }) => api.get<ApiResponse>('/users', { params }),
  
  getUser: (userId: string) => api.get<ApiResponse>(`/users/${userId}`),
  
  updateSafetySettings: (settings: {
    shareLocationWithContacts?: boolean;
    enableEmergencyAlert?: boolean;
    enableAIModeration?: boolean;
    blockUnknownContacts?: boolean;
    autoReportThreats?: boolean;
  }) => api.put<ApiResponse>('/users/safety-settings', settings),
  
  updatePrivacySettings: (settings: {
    profileVisibility?: string;
    shareLocation?: boolean;
    shareStatus?: boolean;
    allowDirectMessages?: boolean;
  }) => api.put<ApiResponse>('/users/privacy-settings', settings),
  
  getUserStats: (userId: string) =>
    api.get<ApiResponse>(`/users/${userId}/stats`),
};

// Helper function to handle API errors
export const handleApiError = (error: AxiosError): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
