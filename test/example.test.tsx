import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Example test - 실제 컴포넌트로 교체하세요
function ExampleComponent() {
  return <div>Hello World</div>;
}

describe('ExampleComponent', () => {
  it('renders hello world', () => {
    render(<ExampleComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});