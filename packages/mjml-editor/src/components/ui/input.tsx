import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      autoComplete="off"
      data-1p-ignore
      className={cn(
        'h-9 w-full min-w-0 rounded-md border border-border bg-background text-foreground px-3 py-1 text-sm',
        'placeholder:text-foreground-muted',
        'transition-smooth',
        'focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Input };
