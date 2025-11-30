import { useState, useEffect, useMemo } from 'react';
import { createTheme, Theme } from '@mui/material/styles';

type ThemeMode = 'light' | 'dark';

export const useThemeMode = () => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as ThemeMode) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme: Theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#6366f1' : '#4f46e5',
            light: mode === 'dark' ? '#818cf8' : '#6366f1',
            dark: mode === 'dark' ? '#4f46e5' : '#4338ca',
            contrastText: '#ffffff',
          },
          secondary: {
            main: mode === 'dark' ? '#ec4899' : '#e91e63',
            light: mode === 'dark' ? '#f472b6' : '#f06292',
            dark: mode === 'dark' ? '#db2777' : '#c2185b',
            contrastText: '#ffffff',
          },
          background: {
            default: mode === 'dark' ? '#0f172a' : '#f8fafc',
            paper: mode === 'dark' ? '#1e293b' : '#ffffff',
          },
          text: {
            primary: mode === 'dark' ? '#f1f5f9' : '#0f172a',
            secondary: mode === 'dark' ? '#cbd5e1' : '#64748b',
          },
          success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
          },
          warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
          },
          error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
          },
          info: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#2563eb',
          },
        },
        shape: {
          borderRadius: 12,
        },
        shadows: [
          'none',
          '0px 2px 4px rgba(0,0,0,0.05)',
          '0px 4px 8px rgba(0,0,0,0.08)',
          '0px 8px 16px rgba(0,0,0,0.1)',
          '0px 12px 24px rgba(0,0,0,0.12)',
          '0px 16px 32px rgba(0,0,0,0.14)',
          '0px 20px 40px rgba(0,0,0,0.16)',
          '0px 24px 48px rgba(0,0,0,0.18)',
          '0px 28px 56px rgba(0,0,0,0.2)',
          '0px 32px 64px rgba(0,0,0,0.22)',
          '0px 36px 72px rgba(0,0,0,0.24)',
          '0px 40px 80px rgba(0,0,0,0.26)',
          '0px 44px 88px rgba(0,0,0,0.28)',
          '0px 48px 96px rgba(0,0,0,0.3)',
          '0px 52px 104px rgba(0,0,0,0.32)',
          '0px 56px 112px rgba(0,0,0,0.34)',
          '0px 60px 120px rgba(0,0,0,0.36)',
          '0px 64px 128px rgba(0,0,0,0.38)',
          '0px 68px 136px rgba(0,0,0,0.4)',
          '0px 72px 144px rgba(0,0,0,0.42)',
          '0px 76px 152px rgba(0,0,0,0.44)',
          '0px 80px 160px rgba(0,0,0,0.46)',
          '0px 84px 168px rgba(0,0,0,0.48)',
          '0px 88px 176px rgba(0,0,0,0.5)',
          '0px 92px 184px rgba(0,0,0,0.52)',
        ],
        typography: {
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
          h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
          },
          h2: {
            fontWeight: 700,
            fontSize: '2rem',
            lineHeight: 1.3,
          },
          h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
            lineHeight: 1.4,
          },
          h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.4,
          },
          h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.5,
          },
          h6: {
            fontWeight: 600,
            fontSize: '1.125rem',
            lineHeight: 1.5,
          },
          button: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                padding: '10px 24px',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                },
              },
              contained: {
                background: mode === 'dark' 
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                '&:hover': {
                  background: mode === 'dark'
                    ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                    : 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow: mode === 'dark'
                  ? '0px 4px 20px rgba(0,0,0,0.3)'
                  : '0px 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: mode === 'dark'
                    ? '0px 8px 30px rgba(0,0,0,0.4)'
                    : '0px 8px 30px rgba(0,0,0,0.12)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                backgroundImage: 'none',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                  '&.Mui-focused': {
                    transform: 'translateY(-2px)',
                  },
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                fontWeight: 500,
              },
            },
          },
        },
      }),
    [mode]
  );

  return {
    theme,
    mode,
    toggleMode,
    setMode,
  };
};
