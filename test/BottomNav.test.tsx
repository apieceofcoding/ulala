import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock NavLink to avoid router context issues
vi.mock('react-router', () => ({
  NavLink: ({ children, to, className }: any) => (
    <a href={to} className={typeof className === 'function' ? className({ isActive: false }) : className}>
      {children}
    </a>
  ),
}));

import { BottomNav } from '@/components/BottomNav';

describe('BottomNav', () => {
  it('renders all five navigation tabs', () => {
    render(<BottomNav />);

    expect(screen.getByText('홈')).toBeInTheDocument();
    expect(screen.getByText('스토리')).toBeInTheDocument();
    expect(screen.getByText('기록')).toBeInTheDocument();
    expect(screen.getByText('보상')).toBeInTheDocument();
    expect(screen.getByText('내정보')).toBeInTheDocument();
  });

  it('renders navigation links with correct paths', () => {
    render(<BottomNav />);

    const homeLink = screen.getByRole('link', { name: /홈/ });
    const storiesLink = screen.getByRole('link', { name: /스토리/ });
    const recordsLink = screen.getByRole('link', { name: /기록/ });
    const rewardsLink = screen.getByRole('link', { name: /보상/ });
    const profileLink = screen.getByRole('link', { name: /내정보/ });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(storiesLink).toHaveAttribute('href', '/stories');
    expect(recordsLink).toHaveAttribute('href', '/records');
    expect(rewardsLink).toHaveAttribute('href', '/rewards');
    expect(profileLink).toHaveAttribute('href', '/profile');
  });

  it('has proper accessibility attributes', () => {
    render(<BottomNav />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(5);
  });
});