import authReducer, { clearCredentials, setCredentials } from '../authSlice';
import { User } from '@/types/api';

describe('authSlice', () => {
  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    gender: 'male',
    image: 'https://example.com/avatar.jpg',
  };

  const mockSuperadminUser: User = {
    id: 2,
    username: 'emilys',
    email: 'admin@example.com',
    firstName: 'Emily',
    lastName: 'Smith',
    gender: 'female',
    image: 'https://example.com/admin-avatar.jpg',
  };

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = authReducer(undefined, { type: 'unknown' });

      expect(state).toEqual({
        token: null,
        user: null,
        isSuperadmin: false,
      });
    });
  });

  describe('setCredentials', () => {
    it('should set user and token for a regular user', () => {
      const previousState = {
        token: null,
        user: null,
        isSuperadmin: false,
      };

      const state = authReducer(
        previousState,
        setCredentials({
          user: mockUser,
          token: 'test-token-123',
        })
      );

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('test-token-123');
      expect(state.isSuperadmin).toBe(false);
    });

    it('should set user and token and mark as superadmin when username matches', () => {
      const previousState = {
        token: null,
        user: null,
        isSuperadmin: false,
      };

      const state = authReducer(
        previousState,
        setCredentials({
          user: mockSuperadminUser,
          token: 'admin-token-456',
          superadminUser: 'emilys',
        })
      );

      expect(state.user).toEqual(mockSuperadminUser);
      expect(state.token).toBe('admin-token-456');
      expect(state.isSuperadmin).toBe(true);
    });

    it('should not mark as superadmin when username does not match', () => {
      const previousState = {
        token: null,
        user: null,
        isSuperadmin: false,
      };

      const state = authReducer(
        previousState,
        setCredentials({
          user: mockUser,
          token: 'test-token-789',
          superadminUser: 'emilys',
        })
      );

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('test-token-789');
      expect(state.isSuperadmin).toBe(false);
    });

    it('should set token but not update isSuperadmin when user is null', () => {
      const previousState = {
        token: null,
        user: null,
        isSuperadmin: false,
      };

      const state = authReducer(
        previousState,
        setCredentials({
          user: null,
          token: 'restore-token-111',
        })
      );

      expect(state.user).toBeNull();
      expect(state.token).toBe('restore-token-111');
      expect(state.isSuperadmin).toBe(false);
    });

    it('should update existing state with new credentials', () => {
      const previousState = {
        token: 'old-token',
        user: mockUser,
        isSuperadmin: false,
      };

      const state = authReducer(
        previousState,
        setCredentials({
          user: mockSuperadminUser,
          token: 'new-token-222',
          superadminUser: 'emilys',
        })
      );

      expect(state.user).toEqual(mockSuperadminUser);
      expect(state.token).toBe('new-token-222');
      expect(state.isSuperadmin).toBe(true);
    });

    it('should not set isSuperadmin when superadminUser is not provided', () => {
      const previousState = {
        token: null,
        user: null,
        isSuperadmin: false,
      };

      const state = authReducer(
        previousState,
        setCredentials({
          user: mockSuperadminUser,
          token: 'token-333',
        })
      );

      expect(state.user).toEqual(mockSuperadminUser);
      expect(state.token).toBe('token-333');
      expect(state.isSuperadmin).toBe(false);
    });

    it('should reset isSuperadmin to false when previously true and new user is not superadmin', () => {
      const previousState = {
        token: 'admin-token',
        user: mockSuperadminUser,
        isSuperadmin: true,
      };

      const state = authReducer(
        previousState,
        setCredentials({
          user: mockUser,
          token: 'new-token-444',
          superadminUser: 'emilys',
        })
      );

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('new-token-444');
      expect(state.isSuperadmin).toBe(false);
    });
  });

  describe('clearCredentials', () => {
    it('should clear all auth state from authenticated user', () => {
      const previousState = {
        token: 'test-token',
        user: mockUser,
        isSuperadmin: false,
      };

      const state = authReducer(previousState, clearCredentials());

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isSuperadmin).toBe(false);
    });

    it('should clear all auth state from superadmin user', () => {
      const previousState = {
        token: 'admin-token',
        user: mockSuperadminUser,
        isSuperadmin: true,
      };

      const state = authReducer(previousState, clearCredentials());

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isSuperadmin).toBe(false);
    });

    it('should maintain initial state when clearing already empty state', () => {
      const previousState = {
        token: null,
        user: null,
        isSuperadmin: false,
      };

      const state = authReducer(previousState, clearCredentials());

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isSuperadmin).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string token', () => {
      const previousState = {
        token: null,
        user: null,
        isSuperadmin: false,
      };

      const state = authReducer(
        previousState,
        setCredentials({
          user: mockUser,
          token: '',
        })
      );

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('');
      expect(state.isSuperadmin).toBe(false);
    });

    it('should handle empty string superadminUser', () => {
      const previousState = {
        token: null,
        user: null,
        isSuperadmin: false,
      };

      const state = authReducer(
        previousState,
        setCredentials({
          user: mockSuperadminUser,
          token: 'token-555',
          superadminUser: '',
        })
      );

      expect(state.user).toEqual(mockSuperadminUser);
      expect(state.token).toBe('token-555');
      expect(state.isSuperadmin).toBe(false);
    });

    it('should handle case-sensitive username comparison for superadmin', () => {
      const previousState = {
        token: null,
        user: null,
        isSuperadmin: false,
      };

      const state = authReducer(
        previousState,
        setCredentials({
          user: mockSuperadminUser,
          token: 'token-666',
          superadminUser: 'EMILYS', // Different case
        })
      );

      expect(state.user).toEqual(mockSuperadminUser);
      expect(state.token).toBe('token-666');
      expect(state.isSuperadmin).toBe(false); // Should not match due to case
    });
  });
});
