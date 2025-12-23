import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';
import { User } from 'lucide-react';
import Image from 'next/image';

const avatarVariants = cva(
  'relative inline-flex items-center justify-center rounded-full bg-gray-100 overflow-hidden',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
        '2xl': 'h-20 w-20 text-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const initials = fallback
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div ref={ref} className={cn(avatarVariants({ size, className }))} {...props}>
        {src && !imageError ? (
          <Image
            src={src}
            alt={alt || 'Avatar'}
            className='h-full w-full object-cover'
            onError={() => setImageError(true)}
          />
        ) : initials ? (
          <span className='font-medium text-gray-600'>{initials}</span>
        ) : (
          <User className='h-1/2 w-1/2 text-gray-400' />
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: VariantProps<typeof avatarVariants>['size'];
  children: React.ReactNode;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 4, size, children, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const visibleChildren = childArray.slice(0, max);
    const remainingCount = childArray.length - max;

    return (
      <div ref={ref} className={cn('flex -space-x-2', className)} {...props}>
        {visibleChildren.map((child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<AvatarProps>, {
                size,
                className: cn(
                  'ring-2 ring-white',
                  (child as React.ReactElement<AvatarProps>).props.className
                ),
              })
            : child
        )}
        {remainingCount > 0 && (
          <div
            className={cn(
              avatarVariants({ size }),
              'ring-2 ring-white bg-gray-200 font-medium text-gray-600'
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup, avatarVariants };
