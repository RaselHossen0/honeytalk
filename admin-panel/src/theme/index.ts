'use client';

import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

/**
 * Professional admin panel theme with custom MUI component overrides.
 * Uses a refined indigo/slate palette and consistent design tokens.
 */

const palette = {
  mode: 'light' as const,
  primary: {
    main: '#4f46e5',
    light: '#818cf8',
    dark: '#4338ca',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#0ea5e9',
    light: '#38bdf8',
    dark: '#0284c7',
    contrastText: '#ffffff',
  },
  error: {
    main: '#dc2626',
    light: '#f87171',
    dark: '#b91c1c',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    contrastText: '#1f2937',
  },
  success: {
    main: '#059669',
    light: '#34d399',
    dark: '#047857',
    contrastText: '#ffffff',
  },
  info: {
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f1f5f9',
    paper: '#ffffff',
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    disabled: '#94a3b8',
  },
  divider: 'rgba(15, 23, 42, 0.08)',
  action: {
    active: 'rgba(15, 23, 42, 0.54)',
    hover: 'rgba(15, 23, 42, 0.04)',
    selected: 'rgba(79, 70, 229, 0.08)',
    disabled: 'rgba(15, 23, 42, 0.26)',
    disabledBackground: 'rgba(15, 23, 42, 0.12)',
  },
  grey: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
};

const typography = {
  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  h1: {
    fontSize: '2rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.25rem',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '0.9375rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '0.9375rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.8125rem',
    lineHeight: 1.6,
  },
  button: {
    fontWeight: 600,
    textTransform: 'none' as const,
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.5,
    color: palette.text.secondary,
  },
};

const shape = {
  borderRadius: 8,
};

const shadows: Theme['shadows'] = [
  'none',
  '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
  '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
  '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.06)',
  '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.06)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  '0 25px 50px -12px rgb(0 0 0 / 0.15)',
];

const components = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 #f1f5f9',
        '&::-webkit-scrollbar': { width: 8, height: 8 },
        '&::-webkit-scrollbar-track': { bgcolor: '#f1f5f9' },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: '#cbd5e1',
          borderRadius: 4,
          '&:hover': { bgcolor: '#94a3b8' },
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '8px 16px',
        fontSize: '0.875rem',
        fontWeight: 600,
        textTransform: 'none',
        boxShadow: 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.06)',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        },
      },
      outlined: {
        borderWidth: 1.5,
        '&:hover': {
          borderWidth: 1.5,
          bgcolor: 'action.hover',
        },
      },
      sizeSmall: {
        padding: '6px 12px',
        fontSize: '0.8125rem',
      },
      sizeLarge: {
        padding: '10px 20px',
        fontSize: '0.9375rem',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        transition: 'all 0.15s ease',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      },
      sizeSmall: {
        padding: 6,
      },
      sizeMedium: {
        padding: 8,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        border: '1px solid',
        borderColor: 'rgba(15, 23, 42, 0.06)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        border: '1px solid',
        borderColor: 'rgba(15, 23, 42, 0.06)',
      },
      outlined: {
        border: '1px solid',
        borderColor: 'rgba(15, 23, 42, 0.08)',
      },
      elevation1: {
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)',
      },
      elevation2: {
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined' as const,
      size: 'small' as const,
    },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          transition: 'all 0.15s ease',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(15, 23, 42, 0.24)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
            borderColor: 'primary.main',
          },
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        backgroundColor: '#ffffff',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(15, 23, 42, 0.12)',
        },
        '&.Mui-disabled': {
          backgroundColor: 'grey.50',
        },
      },
      input: {
        padding: '10px 14px',
        fontSize: '0.875rem',
      },
      inputSizeSmall: {
        padding: '8px 12px',
        fontSize: '0.8125rem',
      },
    },
  },
  MuiFormControl: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
      },
      sizeSmall: {
        fontSize: '0.8125rem',
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      select: {
        padding: '10px 14px',
      },
    },
  },
  MuiTable: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-root': {
          borderBottomColor: 'rgba(15, 23, 42, 0.06)',
          fontSize: '0.8125rem',
        },
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-root': {
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'text.secondary',
          backgroundColor: 'grey.50',
          borderBottom: '1px solid',
          borderBottomColor: 'rgba(15, 23, 42, 0.08)',
        },
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        transition: 'background-color 0.15s ease',
        '&:last-of-type .MuiTableCell-root': {
          borderBottom: 'none',
        },
        '&.MuiTableRow-hover:hover': {
          backgroundColor: 'rgba(79, 70, 229, 0.04)',
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: '12px 16px',
      },
      sizeSmall: {
        padding: '10px 14px',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.2)',
        border: '1px solid',
        borderColor: 'rgba(15, 23, 42, 0.06)',
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: '1.25rem',
        fontWeight: 600,
        padding: '20px 24px',
        borderBottom: '1px solid',
        borderBottomColor: 'rgba(15, 23, 42, 0.08)',
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: 24,
        // Fix: MUI defaults to paddingTop: 0 when next to DialogTitle (sibling selector),
        // which clips the first form field's label. Restore top padding so fields are never cut off.
        ['.MuiDialogTitle-root + &']: {
          paddingTop: 20,
        },
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: '16px 24px',
        borderTop: '1px solid',
        borderTopColor: 'rgba(15, 23, 42, 0.08)',
        gap: 8,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
        fontSize: '0.8125rem',
      },
      sizeSmall: {
        fontSize: '0.75rem',
        height: 24,
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        padding: 8,
        color: 'rgba(15, 23, 42, 0.24)',
        '&.Mui-checked': {
          color: 'primary.main',
        },
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        textDecorationThickness: 1,
        '&:hover': {
          textDecorationThickness: 2,
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: 3,
        borderRadius: '3px 3px 0 0',
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.06)',
        border: '1px solid',
        borderColor: 'rgba(15, 23, 42, 0.06)',
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
        borderRadius: 8,
        margin: '2px 8px',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
        '&.Mui-selected': {
          backgroundColor: 'action.selected',
          '&:hover': {
            backgroundColor: 'action.selected',
          },
        },
      },
    },
  },
  MuiTablePagination: {
    styleOverrides: {
      root: {
        borderTop: '1px solid',
        borderTopColor: 'rgba(15, 23, 42, 0.08)',
      },
      toolbar: {
        paddingLeft: 16,
        paddingRight: 16,
        minHeight: 52,
      },
      selectLabel: {
        fontSize: '0.8125rem',
      },
      displayedRows: {
        fontSize: '0.8125rem',
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontSize: '0.75rem',
        padding: '6px 10px',
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
      standardSuccess: {
        backgroundColor: 'rgba(5, 150, 105, 0.08)',
        color: 'success.dark',
      },
      standardError: {
        backgroundColor: 'rgba(220, 38, 38, 0.08)',
        color: 'error.dark',
      },
      standardWarning: {
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        color: 'warning.dark',
      },
    },
  },
};

export const lightTheme = createTheme({
  palette,
  typography,
  shape,
  shadows,
  components,
});
