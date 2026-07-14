import { test, expect } from '@playwright/test';

test.describe('Protected routes (studio)', () => {
  test('should redirect to /login when accessing the studio without auth', async ({ page }) => {
    await page.goto('/studio');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should redirect to /login when accessing the profile without auth', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe('Protected routes (client portal)', () => {
  test('should redirect to /client/login when accessing client projects without auth', async ({ page }) => {
    await page.goto('/client/projects');
    await expect(page).toHaveURL(/.*client\/login/);
  });
});
