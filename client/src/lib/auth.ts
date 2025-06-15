import { User } from "@shared/schema";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

class AuthService {
  private storageKey = 'sportfolio_auth';

  getAuthState(): AuthState {
    if (typeof window === 'undefined') {
      return { user: null, token: null, isAuthenticated: false };
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          user: parsed.user,
          token: parsed.token,
          isAuthenticated: !!parsed.token
        };
      }
    } catch (error) {
      console.error('Error parsing auth state:', error);
      this.clearAuth();
    }

    return { user: null, token: null, isAuthenticated: false };
  }

  setAuth(user: User, token: string): void {
    if (typeof window === 'undefined') return;

    const authState = { user, token };
    localStorage.setItem(this.storageKey, JSON.stringify(authState));
  }

  clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.storageKey);
  }

  getAuthHeaders(): Record<string, string> {
    const { token } = this.getAuthState();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  hasToolAccess(toolName: string): boolean {
    const { user } = this.getAuthState();
    if (!user) return false;

    // Basic plan users get limited access
    if (user.subscriptionTier === 'basic') {
      return false; // No tool access in basic plan
    }

    // Pro plan gets access to all tools
    if (user.subscriptionTier === 'pro') {
      return true;
    }

    // Enterprise gets everything
    if (user.subscriptionTier === 'enterprise') {
      return true;
    }

    // Check individual tool access
    const toolAccess = user.toolAccess as Record<string, boolean> || {};
    return toolAccess[toolName] || false;
  }

  getSubscriptionLevel(): 'basic' | 'pro' | 'enterprise' | null {
    const { user } = this.getAuthState();
    return user?.subscriptionTier as 'basic' | 'pro' | 'enterprise' | null;
  }

  isSubscriptionActive(): boolean {
    const { user } = this.getAuthState();
    if (!user) return false;

    if (user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'trial') {
      return false;
    }

    if (user.subscriptionExpiry) {
      const expiry = new Date(user.subscriptionExpiry);
      return expiry > new Date();
    }

    return true;
  }
}

export const authService = new AuthService();

export function useAuth() {
  return authService.getAuthState();
}

export function requireAuth() {
  const auth = authService.getAuthState();
  if (!auth.isAuthenticated) {
    throw new Error('Authentication required');
  }
  return auth;
}

export function requireToolAccess(toolName: string) {
  requireAuth();
  if (!authService.hasToolAccess(toolName)) {
    throw new Error(`Access to ${toolName} tool requires a Pro or Enterprise subscription`);
  }
}
