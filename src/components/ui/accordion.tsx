'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils';

interface AccordionContextValue {
    openItems: string[];
    toggleItem: (id: string) => void;
    type: 'single' | 'multiple';
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

const useAccordionContext = () => {
    const context = React.useContext(AccordionContext);
    if (!context) {
        throw new Error('Accordion components must be used within an Accordion provider');
    }
    return context;
};

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: 'single' | 'multiple';
    defaultValue?: string[];
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
    ({ className, type = 'single', defaultValue = [], children, ...props }, ref) => {
        const [openItems, setOpenItems] = React.useState<string[]>(defaultValue);

        const toggleItem = React.useCallback(
            (id: string) => {
                setOpenItems((prev) => {
                    if (type === 'single') {
                        return prev.includes(id) ? [] : [id];
                    }
                    return prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
                });
            },
            [type]
        );

        return (
            <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
                <div ref={ref} className={cn('divide-y divide-gray-200', className)} {...props}>
                    {children}
                </div>
            </AccordionContext.Provider>
        );
    }
);
Accordion.displayName = 'Accordion';

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
    ({ className, value, children, ...props }, ref) => {
        return (
            <div ref={ref} className={cn('', className)} data-value={value} {...props}>
                {children}
            </div>
        );
    }
);
AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
    ({ className, value, children, ...props }, ref) => {
        const { openItems, toggleItem } = useAccordionContext();
        const isOpen = openItems.includes(value);

        return (
            <button
                ref={ref}
                type="button"
                className={cn(
                    'flex w-full items-center justify-between py-4 text-left font-medium transition-colors hover:text-blue-600',
                    className
                )}
                onClick={() => toggleItem(value)}
                aria-expanded={isOpen}
                {...props}
            >
                {children}
                <ChevronDown
                    className={cn(
                        'h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>
        );
    }
);
AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
    ({ className, value, children, ...props }, ref) => {
        const { openItems } = useAccordionContext();
        const isOpen = openItems.includes(value);

        return (
            <div
                ref={ref}
                className={cn(
                    'overflow-hidden transition-all duration-300',
                    isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                )}
                {...props}
            >
                <div className={cn('pb-4', className)}>{children}</div>
            </div>
        );
    }
);
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
