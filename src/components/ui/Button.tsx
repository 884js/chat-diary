'use client';

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-indigo-600', // メインボタン
        secondary: 'bg-secondary text-secondary-foreground hover:bg-slate-200', // サブボタン
        destructive: 'bg-warning-300 text-warning-700 hover:bg-warning-400', // 警告ボタン
        success: 'bg-success-300 text-success-700 hover:bg-success-400', // 成功ボタン
        outline:
          'border border-border bg-background hover:bg-muted text-foreground', // 枠線ボタン
        ghost: 'hover:bg-muted text-foreground', // ゴースト（静かに背景変わる）
        link: 'text-primary underline-offset-4 hover:underline', // リンク型
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
