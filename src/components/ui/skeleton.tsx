import * as React from 'react';
import { cn } from '@/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    (
        {
            className,
            variant = 'text',
            width,
            height,
            animation = 'pulse',
            style,
            ...props
        },
        ref
    ) => {
        const variantClasses = {
            text: 'rounded',
            circular: 'rounded-full',
            rectangular: '',
            rounded: 'rounded-lg',
        };

        const animationClasses = {
            pulse: 'animate-pulse',
            wave: 'animate-shimmer',
            none: '',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'bg-gray-200',
                    variantClasses[variant],
                    animationClasses[animation],
                    className
                )}
                style={{
                    width: typeof width === 'number' ? `${width}px` : width,
                    height: typeof height === 'number' ? `${height}px` : height || (variant === 'text' ? '1em' : undefined),
                    ...style,
                }}
                {...props}
            />
        );
    }
);
Skeleton.displayName = 'Skeleton';

// Pre-built skeleton patterns
export const SkeletonCard = ({ className }: { className?: string }) => (
    <div className={cn('space-y-4 p-4', className)}>
        <Skeleton variant="rectangular" height={200} className="w-full rounded-lg" />
        <div className="space-y-2">
            <Skeleton variant="text" className="w-3/4 h-6" />
            <Skeleton variant="text" className="w-1/2 h-4" />
        </div>
        <div className="flex items-center space-x-2">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="space-y-1 flex-1">
                <Skeleton variant="text" className="w-1/3 h-4" />
                <Skeleton variant="text" className="w-1/4 h-3" />
            </div>
        </div>
    </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
    <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" className="flex-1 h-4" />
                <Skeleton variant="text" className="w-20 h-4" />
                <Skeleton variant="text" className="w-16 h-4" />
            </div>
        ))}
    </div>
);

export { Skeleton };
