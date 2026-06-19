import { Button as BaseButton } from '@base-ui/react/button';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import * as React from 'react';
import { buttonVariants } from './button.css';

type Variants = NonNullable<RecipeVariants<typeof buttonVariants>>;

export interface ButtonProps extends React.ComponentProps<typeof BaseButton>, Variants {
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <BaseButton
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={`${buttonVariants({ variant, size })} ${className || ''}`.trim()}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
