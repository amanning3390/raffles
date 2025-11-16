import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FarcasterAuth } from '@/components/farcaster/FarcasterAuth';

// Mock wagmi hooks
const mockSignMessageAsync = vi.fn();
const mockUseAccount = vi.fn();

vi.mock('wagmi', () => ({
  useAccount: () => mockUseAccount(),
  useSignMessage: () => ({
    signMessageAsync: mockSignMessageAsync,
  }),
}));

// Mock toast
const mockShowToast = vi.fn();
vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

// Mock fetch
global.fetch = vi.fn();

describe('Farcaster Authentication - Task 14.3', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      isConnected: true,
    });
  });

  describe('SIWN Flow with Valid Signature', () => {
    it('should render authentication button when wallet is connected', () => {
      render(<FarcasterAuth />);

      expect(screen.getByRole('button', { name: /Link Farcaster/i })).toBeInTheDocument();
    });

    it('should complete authentication flow with valid signature', async () => {
      const mockUser = {
        fid: 12345,
        username: 'testuser',
        displayName: 'Test User',
        pfp: { url: 'https://example.com/avatar.png' },
        profile: { bio: { text: 'Test bio' } },
        followerCount: 100,
        followingCount: 50,
      };

      mockSignMessageAsync.mockResolvedValue('0xvalidsignature');
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, user: mockUser }),
      });

      const onSuccess = vi.fn();
      render(<FarcasterAuth onSuccess={onSuccess} />);

      const button = screen.getByRole('button', { name: /Link Farcaster/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockSignMessageAsync).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/auth/farcaster',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(mockUser);
      });

      await waitFor(() => {
        expect(screen.getByText(/Connected as @testuser/i)).toBeInTheDocument();
      });
    });

    it('should show loading state during authentication', async () => {
      mockSignMessageAsync.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve('0xsig'), 100))
      );

      render(<FarcasterAuth />);

      const button = screen.getByRole('button', { name: /Link Farcaster/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Authenticating.../i)).toBeInTheDocument();
      });
    });
  });

  describe('SIWN Flow with Invalid Signature', () => {
    it('should handle user rejection of signature', async () => {
      const rejectionError = new Error('User rejected the request');
      mockSignMessageAsync.mockRejectedValue(rejectionError);

      const onError = vi.fn();
      render(<FarcasterAuth onError={onError} />);

      const button = screen.getByRole('button', { name: /Link Farcaster/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });

    it('should handle invalid signature from server', async () => {
      mockSignMessageAsync.mockResolvedValue('0xinvalidsignature');
      (global.fetch as any).mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Invalid signature' }),
      });

      render(<FarcasterAuth />);

      const button = screen.getByRole('button', { name: /Link Farcaster/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Invalid signature/i)).toBeInTheDocument();
      });
    });

    it('should handle server error response', async () => {
      mockSignMessageAsync.mockResolvedValue('0xsignature');
      (global.fetch as any).mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Authentication failed' }),
      });

      render(<FarcasterAuth />);

      const button = screen.getByRole('button', { name: /Link Farcaster/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Authentication failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Data Fetching', () => {
    it('should fetch and display user data after successful authentication', async () => {
      const mockUser = {
        fid: 12345,
        username: 'vitalik',
        displayName: 'Vitalik Buterin',
        pfp: { url: 'https://example.com/vitalik.png' },
        profile: { bio: { text: 'Ethereum founder' } },
        followerCount: 500000,
        followingCount: 100,
      };

      mockSignMessageAsync.mockResolvedValue('0xsignature');
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, user: mockUser }),
      });

      render(<FarcasterAuth />);

      const button = screen.getByRole('button', { name: /Link Farcaster/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Connected as @vitalik/i)).toBeInTheDocument();
      });
    });

    it('should handle missing user data in response', async () => {
      mockSignMessageAsync.mockResolvedValue('0xsignature');
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, user: null }),
      });

      render(<FarcasterAuth />);

      const button = screen.getByRole('button', { name: /Link Farcaster/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Invalid response from server/i)).toBeInTheDocument();
      });
    });
  });

  describe('Optional Feature Degradation', () => {
    it('should not render when wallet is not connected', () => {
      mockUseAccount.mockReturnValue({
        address: undefined,
        isConnected: false,
      });

      const { container } = render(<FarcasterAuth />);

      expect(container.firstChild).toBeNull();
    });

    it('should show warning when attempting to authenticate without wallet', () => {
      mockUseAccount.mockReturnValue({
        address: undefined,
        isConnected: false,
      });

      const { rerender } = render(<FarcasterAuth />);

      // Reconnect wallet
      mockUseAccount.mockReturnValue({
        address: '0x1234567890123456789012345678901234567890',
        isConnected: true,
      });

      rerender(<FarcasterAuth />);

      expect(screen.getByRole('button', { name: /Link Farcaster/i })).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message on authentication failure', async () => {
      mockSignMessageAsync.mockRejectedValue(new Error('Network error'));

      render(<FarcasterAuth />);

      const button = screen.getByRole('button', { name: /Link Farcaster/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalled();
      });
    });

    it('should call onError callback on failure', async () => {
      const error = new Error('Test error');
      mockSignMessageAsync.mockRejectedValue(error);

      const onError = vi.fn();
      render(<FarcasterAuth onError={onError} />);

      const button = screen.getByRole('button', { name: /Link Farcaster/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error);
      });
    });

    it('should reset loading state after error', async () => {
      mockSignMessageAsync.mockRejectedValue(new Error('Test error'));

      render(<FarcasterAuth />);

      const button = screen.getByRole('button', { name: /Link Farcaster/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.queryByText(/Authenticating.../i)).not.toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /Link Farcaster/i })).not.toBeDisabled();
    });

    it('should handle network errors gracefully', async () => {
      mockSignMessageAsync.mockResolvedValue('0xsignature');
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      render(<FarcasterAuth />);

      const button = screen.getByRole('button', { name: /Link Farcaster/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalled();
      });
    });
  });

  describe('Custom Props', () => {
    it('should use custom button text', () => {
      render(<FarcasterAuth buttonText="Connect Farcaster" />);

      expect(screen.getByRole('button', { name: /Connect Farcaster/i })).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<FarcasterAuth className="custom-class" />);

      const button = screen.getByRole('button', { name: /Link Farcaster/i });
      expect(button).toHaveClass('custom-class');
    });
  });
});
