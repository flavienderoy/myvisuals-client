import { test, expect } from '@playwright/test';

test.describe('Dashboard access', () => {
  test('should prevent access to dashboard without auth', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    
    // It should redirect back to signin
    await expect(page).toHaveURL(/.*signin/);
  });

  test('should prevent access to projects without auth', async ({ page }) => {
    await page.goto('http://localhost:5173/projects');
    
    // It should redirect back to signin
    await expect(page).toHaveURL(/.*signin/);
  });
});
