'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils';

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    showValue?: boolean;
    count?: number;
    onRatingChange?: (rating: number) => void;
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
    (
        {
            className,
            value = 0,
            max = 5,
            size = 'md',
            interactive = false,
            showValue = false,
            count,
            onRatingChange,
            ...props
        },
        ref
    ) => {
        const [hoverValue, setHoverValue] = React.useState<number | null>(null);

        const sizeClasses = {
            sm: 'w-3.5 h-3.5',
            md: 'w-5 h-5',
            lg: 'w-6 h-6',
        };

        const displayValue = hoverValue !== null ? hoverValue : value;

        return (
            <div ref={ref} className={cn('inline-flex items-center gap-1', className)} {...props}>
                <div className="flex items-center">
                    {Array.from({ length: max }, (_, index) => {
                        const starValue = index + 1;
                        const isFilled = displayValue >= starValue;
                        const isHalfFilled = displayValue >= starValue - 0.5 && displayValue < starValue;

                        return (
                            <button
                                key={index}
                                type="button"
                                disabled={!interactive}
                                className={cn(
                                    'relative transition-transform',
                                    interactive && 'cursor-pointer hover:scale-110',
                                    !interactive && 'cursor-default'
                                )}
                                onMouseEnter={() => interactive && setHoverValue(starValue)}
                                onMouseLeave={() => interactive && setHoverValue(null)}
                                onClick={() => interactive && onRatingChange?.(starValue)}
                            >
                                <Star
                                    className={cn(
                                        sizeClasses[size],
                                        'transition-colors',
                                        isFilled
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : isHalfFilled
                                                ? 'fill-yellow-400/50 text-yellow-400'
                                                : 'fill-gray-200 text-gray-200'
                                    )}
                                />
                            </button>
                        );
                    })}
                </div>
                {showValue && (
                    <span className="ml-1 text-sm font-semibold text-gray-900">{value.toFixed(1)}</span>
                )}
                {count !== undefined && (
                    <span className="ml-1 text-sm text-gray-500">({count.toLocaleString()})</span>
                )}
            </div>
        );
    }
);
Rating.displayName = 'Rating';

export { Rating };
