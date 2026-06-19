import { recipe } from '@vanilla-extract/recipes';

export const buttonVariants = recipe({
  base: {
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: 'calc(var(--radius) - 2px)',
    fontSize: '0.875rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    transitionProperty: 'all',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '150ms',
    outline: 'none',

    ':focus-visible': {
      borderColor: 'hsl(var(--ring))',
      boxShadow: '0 0 0 3px hsla(var(--ring) / 0.5)',
    },

    selectors: {
      '&:disabled': {
        pointerEvents: 'none',
        opacity: 0.5,
      },
      '&[aria-invalid="true"]': {
        borderColor: 'hsl(var(--destructive))',
        boxShadow: '0 0 0 3px hsla(var(--destructive) / 0.2)',
      },
      '.dark &[aria-invalid="true"]': {
        boxShadow: '0 0 0 3px hsla(var(--destructive) / 0.4)',
      },
      '& svg': {
        pointerEvents: 'none',
        flexShrink: 0,
      },
      '& svg:not([class*="size-"])': {
        width: '1rem',
        height: '1rem',
      },
    },
  },

  variants: {
    variant: {
      default: {
        backgroundColor: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        ':hover': { backgroundColor: 'hsla(var(--primary) / 0.9)' },
      },
      destructive: {
        backgroundColor: 'hsl(var(--destructive))',
        color: 'white',
        ':hover': { backgroundColor: 'hsla(var(--destructive) / 0.9)' },
        ':focus-visible': {
          boxShadow: '0 0 0 3px hsla(var(--destructive) / 0.2)',
        },
        selectors: {
          '.dark &': { backgroundColor: 'hsla(var(--destructive) / 0.6)' },
          '.dark &:focus-visible': {
            boxShadow: '0 0 0 3px hsla(var(--destructive) / 0.4)',
          },
        },
      },
      outline: {
        border: '1px solid hsl(var(--input))',
        backgroundColor: 'hsl(var(--background))',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        ':hover': {
          backgroundColor: 'hsl(var(--accent))',
          color: 'hsl(var(--accent-foreground))',
        },
        selectors: {
          '.dark &': {
            borderColor: 'hsl(var(--input))',
            backgroundColor: 'hsla(var(--input) / 0.3)',
          },
          '.dark &:hover': { backgroundColor: 'hsla(var(--input) / 0.5)' },
        },
      },
      secondary: {
        backgroundColor: 'hsl(var(--secondary))',
        color: 'hsl(var(--secondary-foreground))',
        ':hover': { backgroundColor: 'hsla(var(--secondary) / 0.8)' },
      },
      ghost: {
        ':hover': {
          backgroundColor: 'hsl(var(--accent))',
          color: 'hsl(var(--accent-foreground))',
        },
        selectors: {
          '.dark &:hover': { backgroundColor: 'hsla(var(--accent) / 0.5)' },
        },
      },
      link: {
        color: 'hsl(var(--primary))',
        textUnderlineOffset: '4px',
        ':hover': { textDecorationLine: 'underline' },
      },
    },

    size: {
      default: {
        height: '2.25rem',
        padding: '0.5rem 1rem',
        selectors: {
          '&:has(> svg)': { paddingLeft: '0.75rem', paddingRight: '0.75rem' },
        },
      },
      xs: {
        height: '1.5rem',
        gap: '0.25rem',
        borderRadius: 'calc(var(--radius) - 2px)',
        padding: '0 0.5rem',
        fontSize: '0.75rem',
        selectors: {
          '&:has(> svg)': { paddingLeft: '0.375rem', paddingRight: '0.375rem' },
          '& svg:not([class*="size-"])': {
            width: '0.75rem',
            height: '0.75rem',
          },
        },
      },
      sm: {
        height: '2rem',
        gap: '0.375rem',
        borderRadius: 'calc(var(--radius) - 2px)',
        padding: '0 0.75rem',
        selectors: {
          '&:has(> svg)': { paddingLeft: '0.625rem', paddingRight: '0.625rem' },
        },
      },
      lg: {
        height: '2.5rem',
        borderRadius: 'calc(var(--radius) - 2px)',
        padding: '0 1.5rem',
        selectors: {
          '&:has(> svg)': { paddingLeft: '1rem', paddingRight: '1rem' },
        },
      },
      icon: {
        width: '2.25rem',
        height: '2.25rem',
      },
      'icon-xs': {
        width: '1.5rem',
        height: '1.5rem',
        borderRadius: 'calc(var(--radius) - 2px)',
        selectors: {
          '& svg:not([class*="size-"])': {
            width: '0.75rem',
            height: '0.75rem',
          },
        },
      },
      'icon-sm': {
        width: '2rem',
        height: '2rem',
      },
      'icon-lg': {
        width: '2.5rem',
        height: '2.5rem',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});
