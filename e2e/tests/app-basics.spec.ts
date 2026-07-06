import { test, expect } from '@playwright/test';

test.describe('Basic Application Setup', () => {
  test('has correct document title', async ({ page }) => {
    await page.goto('http://localhost:5173/signin');
    await expect(page).toHaveTitle(/Visuals|myvisuals/i);
  });

  test('should display the main brand logo on login', async ({ page }) => {
    await page.goto('http://localhost:5173/signin');
    
    // Look for the logo text "myvisuals"
    await expect(page.getByText('myvisuals', { exact: false })).toBeVisible();
  });
});
