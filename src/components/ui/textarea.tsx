import * as React from 'react';
import { cn } from '@/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, resize = 'vertical', ...props }, ref) => {
        const resizeClasses = {
            none: 'resize-none',
            vertical: 'resize-y',
            horizontal: 'resize-x',
            both: 'resize',
        };

        return (
            <textarea
                ref={ref}
                className={cn(
                    'flex min-h-[120px] w-full rounded-md border bg-white px-3 py-2 text-sm',
                    'placeholder:text-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    error ? 'border-red-500' : 'border-gray-300',
                    resizeClasses[resize],
                    className
                )}
                {...props}
            />
        );
    }
);
Textarea.displayName = 'Textarea';

export { Textarea };
