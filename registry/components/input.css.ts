import { style } from '@vanilla-extract/css';

export const input = style({
  display: 'flex',
  height: '2.25rem',
  width: '100%',
  minWidth: 0,
  borderRadius: 'calc(var(--radius) - 2px)',
  border: '1px solid hsl(var(--input))',
  backgroundColor: 'transparent',
  padding: '0.25rem 0.75rem',
  fontSize: '1rem',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  transitionProperty: 'color, box-shadow, border-color',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  transitionDuration: '150ms',
  outline: 'none',

  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '0.875rem',
    },
  },

  '::selection': {
    backgroundColor: 'hsl(var(--primary))',
    color: 'hsl(var(--primary-foreground))',
  },

  '::placeholder': {
    color: 'hsl(var(--muted-foreground))',
  },

  selectors: {
    '&:focus-visible': {
      borderColor: 'hsl(var(--ring))',
      boxShadow: '0 0 0 3px hsla(var(--ring) / 0.5)',
    },
    '&:disabled': {
      pointerEvents: 'none',
      cursor: 'not-allowed',
      opacity: 0.5,
    },
    '&[aria-invalid="true"]': {
      borderColor: 'hsl(var(--destructive))',
      boxShadow: '0 0 0 3px hsla(var(--destructive) / 0.2)',
    },
    '.dark &[aria-invalid="true"]': {
      boxShadow: '0 0 0 3px hsla(var(--destructive) / 0.4)',
    },
    '.dark &': {
      backgroundColor: 'hsla(var(--input) / 0.3)',
    },
    '&::file-selector-button': {
      display: 'inline-flex',
      height: '1.75rem',
      border: 0,
      backgroundColor: 'transparent',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: 'hsl(var(--foreground))',
    },
  },
});
