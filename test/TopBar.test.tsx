import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock useAuth
const mockMember = {
  id: 'test-id',
  username: 'testuser',
  displayName: '테스트유저',
  level: 5,
  exp: 100,
};

let authMock: {
  member: typeof mockMember | null;
  accessToken: string | null;
} = {
  member: mockMember,
  accessToken: 'test-token',
};

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => authMock,
}));

// Mock useNavigate for TopBar
vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

import { TopBar } from '@/components/TopBar';

describe('TopBar', () => {
  beforeEach(() => {
    // Reset auth mock before each test
    authMock = {
      member: mockMember,
      accessToken: 'test-token',
    };
  });

  it('renders member level when logged in', () => {
    render(<TopBar />);
    expect(screen.getByText('Lv.5')).toBeInTheDocument();
  });

  it('renders member displayName when logged in', () => {
    render(<TopBar />);
    expect(screen.getByText('테스트유저')).toBeInTheDocument();
  });

  it('renders login message when not logged in', () => {
    authMock.member = null;
    render(<TopBar />);
    expect(screen.getByText('로그인하세요')).toBeInTheDocument();
  });

  it('renders menu button with proper aria-label', () => {
    render(<TopBar />);
    const menuButton = screen.getByRole('button', { name: '메뉴' });
    expect(menuButton).toBeInTheDocument();
  });

  it('calls onSettingsClick when menu button is clicked', () => {
    const mockOnSettingsClick = vi.fn();
    render(<TopBar onSettingsClick={mockOnSettingsClick} />);

    const menuButton = screen.getByRole('button', { name: '메뉴' });
    fireEvent.click(menuButton);

    expect(mockOnSettingsClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(<TopBar className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});