import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button', () => {
    it('renders with default props', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('renders with different variants', () => {
        const { rerender } = render(<Button variant="default">Default</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

        rerender(<Button variant="destructive">Destructive</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-red-600');

        rerender(<Button variant="outline">Outline</Button>);
        expect(screen.getByRole('button')).toHaveClass('border');

        rerender(<Button variant="secondary">Secondary</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-gray-100');

        rerender(<Button variant="ghost">Ghost</Button>);
        expect(screen.getByRole('button')).toHaveClass('hover:bg-gray-100');

        rerender(<Button variant="link">Link</Button>);
        expect(screen.getByRole('button')).toHaveClass('text-blue-600');
    });

    it('renders with different sizes', () => {
        const { rerender } = render(<Button size="default">Default</Button>);
        expect(screen.getByRole('button')).toHaveClass('h-10');

        rerender(<Button size="sm">Small</Button>);
        expect(screen.getByRole('button')).toHaveClass('h-9');

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByRole('button')).toHaveClass('h-11');

        rerender(<Button size="icon">Icon</Button>);
        expect(screen.getByRole('button')).toHaveClass('w-10');
    });

    it('handles click events', async () => {
        const user = userEvent.setup();
        let clicked = false;
        render(<Button onClick={() => (clicked = true)}>Click me</Button>);

        await user.click(screen.getByRole('button'));
        expect(clicked).toBe(true);
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies custom className', () => {
        render(<Button className="custom-class">Custom</Button>);
        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
        const ref = { current: null as HTMLButtonElement | null };
        render(<Button ref={ref}>With Ref</Button>);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
});
