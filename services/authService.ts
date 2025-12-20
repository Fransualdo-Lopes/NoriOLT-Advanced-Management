
import { AuthCredentials, AuthResponse } from '../types';

/**
 * Mock Auth Service
 * In a real scenario, this would call apiClient.post('/login', credentials)
 */
export const authService = {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock validation
    if (credentials.username === 'admin' && credentials.password === 'password') {
      const mockResponse: AuthResponse = {
        token: 'mock_jwt_token_nori_olt_2025',
        user: {
          id: 'u1',
          username: 'Admin Nori',
          role: 'ADMIN', // Alterado de 'Network Architect' para 'ADMIN' para alinhar com roles.ts
          level: 'Super Admin'
        }
      };
      
      localStorage.setItem('nori_auth_token', mockResponse.token);
      localStorage.setItem('nori_user', JSON.stringify(mockResponse.user));
      
      return mockResponse;
    }
    
    throw new Error('Invalid credentials');
  },

  logout() {
    localStorage.removeItem('nori_auth_token');
    localStorage.removeItem('nori_user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('nori_auth_token');
  },

  getCurrentUser() {
    const user = localStorage.getItem('nori_user');
    return user ? JSON.parse(user) : null;
  }
};
