'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils';
import { Button } from './button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}: ModalProps) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Overlay */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity'
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden='true'
      />

      {/* Modal Content */}
      <div
        className={cn(
          'relative w-full mx-4 bg-white rounded-xl shadow-2xl transform transition-all',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          sizeClasses[size],
          className
        )}
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            <div>
              {title && (
                <h2 id='modal-title' className='text-xl font-semibold text-gray-900'>
                  {title}
                </h2>
              )}
              {description && (
                <p id='modal-description' className='mt-1 text-sm text-gray-600'>
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <Button
                variant='ghost'
                size='icon'
                onClick={onClose}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='h-5 w-5' />
                <span className='sr-only'>Close</span>
              </Button>
            )}
          </div>
        )}

        {/* Body */}
        <div className='p-6'>{children}</div>
      </div>
    </div>
  );
};
Modal.displayName = 'Modal';

export type ModalFooterProps = React.HTMLAttributes<HTMLDivElement>;

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ModalFooter.displayName = 'ModalFooter';

export { Modal, ModalFooter };
