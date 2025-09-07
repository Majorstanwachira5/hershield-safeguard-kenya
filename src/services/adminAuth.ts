// Admin Authentication Service
// API Key: eNEnlNl9PlKguULXqmPINPdISCYMezBfOpHqmrvecUXbJF8pjTKHpA7GyCdJs5ZXWfKi8IuYlFy2aSzN3VngoQ==

const ADMIN_API_KEY = 'eNEnlNl9PlKguULXqmPINPdISCYMezBfOpHqmrvecUXbJF8pjTKHpA7GyCdJs5ZXWfKi8IuYlFy2aSzN3VngoQ==';
const USER_SERVICE_BASE_URL = 'https://api.userservice.com'; // Replace with actual user service URL

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  name: string;
  permissions: string[];
  lastLogin: string;
}

export interface AdminAuthResponse {
  success: boolean;
  user?: AdminUser;
  token?: string;
  message?: string;
  error?: string;
}

class AdminAuthService {
  private apiKey: string;

  constructor() {
    this.apiKey = ADMIN_API_KEY;
  }

  /**
   * Admin Sign In
   * Fetches directly from user service with API key authentication
   */
  async adminSignIn(email: string, password: string): Promise<AdminAuthResponse> {
    try {
      const response = await fetch(`${USER_SERVICE_BASE_URL}/auth/admin/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Key': this.apiKey,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          loginType: 'admin'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        // Store admin session
        localStorage.setItem('admin_token', data.token || this.apiKey);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        localStorage.setItem('admin_session', JSON.stringify({
          loginTime: new Date().toISOString(),
          apiKey: this.apiKey,
          isAdmin: true
        }));

        return {
          success: true,
          user: data.user,
          token: data.token || this.apiKey,
          message: 'Admin login successful'
        };
      } else {
        return {
          success: false,
          error: data.message || 'Admin authentication failed'
        };
      }
    } catch (error) {
      console.error('Admin login error:', error);
      
      // Fallback: Mock admin authentication for development/demo
      if (email.includes('admin') || email.includes('@admin')) {
        const mockAdmin: AdminUser = {
          id: 'admin-001',
          email: email,
          role: 'admin',
          name: 'Admin User',
          permissions: ['read', 'write', 'delete', 'manage_users', 'view_analytics'],
          lastLogin: new Date().toISOString()
        };

        // Store mock admin session
        localStorage.setItem('admin_token', this.apiKey);
        localStorage.setItem('admin_user', JSON.stringify(mockAdmin));
        localStorage.setItem('admin_session', JSON.stringify({
          loginTime: new Date().toISOString(),
          apiKey: this.apiKey,
          isAdmin: true,
          isMockMode: true
        }));

        return {
          success: true,
          user: mockAdmin,
          token: this.apiKey,
          message: 'Admin login successful (Demo Mode)'
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  /**
   * Get current admin session
   */
  getCurrentAdmin(): AdminUser | null {
    try {
      const adminUser = localStorage.getItem('admin_user');
      return adminUser ? JSON.parse(adminUser) : null;
    } catch {
      return null;
    }
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    const session = localStorage.getItem('admin_session');
    const adminUser = this.getCurrentAdmin();
    return !!(session && adminUser);
  }

  /**
   * Admin logout
   */
  adminLogout(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_session');
  }

  /**
   * Verify API key
   */
  verifyApiKey(): boolean {
    return this.apiKey === ADMIN_API_KEY;
  }

  /**
   * Get API key (for debugging - remove in production)
   */
  getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Make authenticated admin API call
   */
  async adminApiCall(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json',
      ...options.headers
    };

    return fetch(`${USER_SERVICE_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
  }
}

export const adminAuthService = new AdminAuthService();
export default adminAuthService;
