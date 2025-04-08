import { render, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './theme-context';
import React from 'react';

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
const matchMediaMock = jest.fn();

Object.defineProperty(window, 'matchMedia', {
  value: matchMediaMock,
});

// Test component that uses the theme context
function TestComponent() {
  const { theme, setTheme } = useTheme();
  return (
    <div data-testid="test-component">
      <div data-testid="current-theme">{theme}</div>
      <button onClick={() => setTheme('light')} data-testid="set-light">
        Set Light
      </button>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={() => setTheme('system')} data-testid="set-system">
        Set System
      </button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.documentElement.classList.remove('light', 'dark');
    
    // Default matchMedia mock implementation
    matchMediaMock.mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it('provides default theme as system when no localStorage value exists', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(getByTestId('current-theme').textContent).toBe('system');
  });

  it('uses theme from localStorage if available', () => {
    localStorageMock.setItem('theme', 'dark');
    
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(getByTestId('current-theme').textContent).toBe('dark');
  });

  it('updates theme when setTheme is called', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initial theme is system
    expect(getByTestId('current-theme').textContent).toBe('system');
    
    // Change to light theme
    act(() => {
      getByTestId('set-light').click();
    });
    
    expect(getByTestId('current-theme').textContent).toBe('light');
    expect(localStorageMock.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    
    // Change to dark theme
    act(() => {
      getByTestId('set-dark').click();
    });
    
    expect(getByTestId('current-theme').textContent).toBe('dark');
    expect(localStorageMock.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('applies system theme based on user preference', () => {
    // Mock system preference as dark
    matchMediaMock.mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Set to system theme
    act(() => {
      getByTestId('set-system').click();
    });
    
    expect(getByTestId('current-theme').textContent).toBe('system');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    
    // Change system preference to light
    matchMediaMock.mockImplementation((query) => ({
      matches: query !== '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    
    // Simulate media query change event
    act(() => {
      const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
      const event = new Event('change');
      mediaQueryList.dispatchEvent(event);
    });
    
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('throws error when useTheme is used outside of ThemeProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');
    
    // Restore console.error
    console.error = originalError;
  });
});
