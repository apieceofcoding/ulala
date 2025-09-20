import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock useLocation for TopBar
vi.mock('react-router', () => ({
  useLocation: () => ({ pathname: '/' }),
}));

import { TopBar } from '@/components/TopBar';

describe('TopBar', () => {
  it('renders current tab name correctly', () => {
    render(<TopBar />);
    expect(screen.getByText('홈')).toBeInTheDocument();
  });

  it('renders default level', () => {
    render(<TopBar />);
    expect(screen.getByText('Lv.1')).toBeInTheDocument();
  });

  it('renders custom level', () => {
    render(<TopBar level={5} />);
    expect(screen.getByText('Lv.5')).toBeInTheDocument();
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