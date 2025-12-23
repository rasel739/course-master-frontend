'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    options: SelectOption[];
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    onChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
    (
        { className, options, value, placeholder = 'Select...', disabled, error, onChange, ...props },
        ref
    ) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const containerRef = React.useRef<HTMLDivElement>(null);

        const selectedOption = options.find((opt) => opt.value === value);

        React.useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        return (
            <div ref={containerRef} className={cn('relative', className)} {...props}>
                <button
                    ref={ref as React.Ref<HTMLButtonElement>}
                    type="button"
                    disabled={disabled}
                    className={cn(
                        'flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error ? 'border-red-500' : 'border-gray-300',
                        !disabled && 'hover:border-gray-400'
                    )}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    <span className={cn(!selectedOption && 'text-gray-500')}>
                        {selectedOption?.label || placeholder}
                    </span>
                    <ChevronDown
                        className={cn(
                            'h-4 w-4 text-gray-500 transition-transform',
                            isOpen && 'rotate-180'
                        )}
                    />
                </button>

                {isOpen && (
                    <div
                        className={cn(
                            'absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg',
                            'animate-in fade-in-0 zoom-in-95'
                        )}
                        role="listbox"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                disabled={option.disabled}
                                className={cn(
                                    'flex w-full items-center justify-between px-3 py-2 text-sm',
                                    'hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
                                    option.disabled && 'cursor-not-allowed opacity-50',
                                    option.value === value && 'bg-blue-50 text-blue-600'
                                )}
                                onClick={() => {
                                    if (!option.disabled) {
                                        onChange?.(option.value);
                                        setIsOpen(false);
                                    }
                                }}
                                role="option"
                                aria-selected={option.value === value}
                            >
                                {option.label}
                                {option.value === value && <Check className="h-4 w-4" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }
);
Select.displayName = 'Select';

export { Select };
