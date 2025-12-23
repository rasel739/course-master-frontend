import * as React from 'react';
import { cn } from '@/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'success' | 'warning' | 'purple';
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    (
        { className, value = 0, max = 100, showLabel = false, size = 'md', variant = 'default', ...props },
        ref
    ) => {
        const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

        const sizeClasses = {
            sm: 'h-1.5',
            md: 'h-2.5',
            lg: 'h-4',
        };

        const variantClasses = {
            default: 'bg-blue-600',
            success: 'bg-green-600',
            warning: 'bg-yellow-500',
            purple: 'bg-purple-600',
        };

        return (
            <div className={cn('w-full', className)} ref={ref} {...props}>
                {showLabel && (
                    <div className="flex justify-between mb-1 text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{Math.round(percentage)}%</span>
                    </div>
                )}
                <div
                    className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                >
                    <div
                        className={cn(
                            'h-full rounded-full transition-all duration-500 ease-out',
                            variantClasses[variant]
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        );
    }
);
Progress.displayName = 'Progress';

export { Progress };
