import * as React from 'react';
import { input } from './input.css';

export interface InputProps extends React.ComponentProps<'input'> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`${input} ${className || ''}`.trim()}
        ref={ref}
        data-slot="input"
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export { Input };
