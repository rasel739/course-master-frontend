import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default: 'bg-blue-600 text-white hover:bg-blue-700',
                secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
                success: 'bg-green-100 text-green-800 hover:bg-green-200',
                warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
                destructive: 'bg-red-100 text-red-800 hover:bg-red-200',
                outline: 'border border-gray-300 text-gray-700 bg-transparent',
                purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant, ...props }, ref) => {
        return (
            <div ref={ref} className={cn(badgeVariants({ variant, className }))} {...props} />
        );
    }
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
