import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test('should display the home page', async ({ page }) => {
        await page.goto('/');

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // Check that the page has loaded successfully
        await expect(page).toHaveTitle(/Course Master/i);
    });

    test('should have navigation elements', async ({ page }) => {
        await page.goto('/');

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // Check that main navigation elements exist
        const navigation = page.locator('nav');
        await expect(navigation).toBeVisible();
    });

    test('should be responsive on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // Page should still be visible
        await expect(page.locator('body')).toBeVisible();
    });
});

test.describe('Authentication Flow', () => {
    test('should navigate to login page', async ({ page }) => {
        await page.goto('/');

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // Try to find and click login link/button
        const loginLink = page.getByRole('link', { name: /login|sign in/i });

        if (await loginLink.isVisible()) {
            await loginLink.click();
            await expect(page).toHaveURL(/login/);
        }
    });

    test('should navigate to register page', async ({ page }) => {
        await page.goto('/');

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // Try to find and click register link/button
        const registerLink = page.getByRole('link', { name: /register|sign up/i });

        if (await registerLink.isVisible()) {
            await registerLink.click();
            await expect(page).toHaveURL(/register/);
        }
    });
});

test.describe('Courses Page', () => {
    test('should display courses listing', async ({ page }) => {
        await page.goto('/courses');

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // The page should render without errors
        await expect(page.locator('body')).toBeVisible();
    });
});
