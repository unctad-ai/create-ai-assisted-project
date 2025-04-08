import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './theme-toggle';
import { ThemeProvider } from '../../context/theme-context';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  it('renders theme toggle buttons', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByLabelText('Light mode')).toBeInTheDocument();
    expect(screen.getByLabelText('Dark mode')).toBeInTheDocument();
    expect(screen.getByLabelText('System theme')).toBeInTheDocument();
  });

  it('changes theme when buttons are clicked', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // Initially system theme is active
    expect(localStorageMock.getItem('theme')).toBe('system');

    // Click light mode button
    fireEvent.click(screen.getByLabelText('Light mode'));
    expect(localStorageMock.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);

    // Click dark mode button
    fireEvent.click(screen.getByLabelText('Dark mode'));
    expect(localStorageMock.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Click system theme button
    fireEvent.click(screen.getByLabelText('System theme'));
    expect(localStorageMock.getItem('theme')).toBe('system');
  });
});
