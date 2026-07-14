import { test, expect } from '@playwright/test';

test.describe('Basic Application Setup', () => {
  test('has correct document title', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Visuals|myvisuals/i);
  });

  test('should display the main brand logo on login', async ({ page }) => {
    await page.goto('/login');
    // Brand wordmark "myvisuals" is rendered in the auth layout
    await expect(page.getByText('myvisuals', { exact: false }).first()).toBeVisible();
  });

  test('landing page is reachable at root', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/$/);
  });
});
