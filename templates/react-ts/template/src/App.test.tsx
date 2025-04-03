import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('renders project name', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('React Application');
  });

  it('updates count when button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Count is 0');
    
    await user.click(button);
    expect(button).toHaveTextContent('Count is 1');
  });

  it('displays project resources', () => {
    render(<App />);
    
    expect(screen.getByText('Development Guidelines')).toBeInTheDocument();
    expect(screen.getByText('Review Guidelines')).toBeInTheDocument();
    expect(screen.getByText('Project Memory')).toBeInTheDocument();
    expect(screen.getByText('Todo List')).toBeInTheDocument();
  });
});
