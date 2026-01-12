/**
 * Auth Service
 * Handles all authentication-related business logic
 * - Token management (store, retrieve, clear)
 * - Login/logout flows
 * - Token expiry checks
 * - Role-based checks
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

class AuthService {
  constructor() {
    this.tokenKey = 'auth_token';
    this.userKey = 'user_data';
    this.refreshTokenKey = 'refresh_token';
  }

  /**
   * Store auth tokens and user data
   */
  setAuth(token, user, refreshToken = null) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  /**
   * Get stored token
   */
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Get stored user data
   */
  getUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if token exists and is valid
   */
  isAuthenticated() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Check if user has specific role
   */
  hasRole(requiredRole) {
    const user = this.getUser();
    return user && user.role === requiredRole;
  }

  /**
   * Check if user is admin
   */
  isAdmin() {
    return this.hasRole('admin');
  }

  /**
   * Parse JWT payload without verification (client-side only)
   */
  parseToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token) {
    const payload = this.parseToken(token);
    if (!payload || !payload.exp) return true;

    // Check if expiry is within 5 minutes
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutes

    return currentTime > expiryTime - bufferTime;
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { token, user, refreshToken } = response.data;
      this.setAuth(token, user, refreshToken);

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  }

  /**
   * Signup user
   */
  async signup(userData) {
    try {
      const response = await axios.post(`${API_URL}/signup`, userData);

      const { token, user, refreshToken } = response.data;
      this.setAuth(token, user, refreshToken);

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed',
      };
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  /**
   * Auto logout on token expiry
   */
  checkTokenExpiry() {
    const token = this.getToken();
    if (token && this.isTokenExpired(token)) {
      this.logout();
      window.dispatchEvent(new Event('auth:logout'));
      return true;
    }
    return false;
  }

  /**
   * Attempt to refresh token (if backend supports)
   */
  async refreshToken() {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    if (!refreshToken) return false;

    try {
      const response = await axios.post(`${API_URL}/refresh-token`, {
        refreshToken,
      });

      const { token } = response.data;
      localStorage.setItem(this.tokenKey, token);
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }
}

export default new AuthService();
