import { test, expect } from '@playwright/test';

test.describe('Protected routes (studio)', () => {
  // Every studio surface must bounce an unauthenticated visitor to /login
  const studioRoutes = ['/studio', '/studio/team', '/profile', '/tickets', '/team', '/messages'];
  for (const route of studioRoutes) {
    test(`redirects ${route} to /login without auth`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/.*login/);
    });
  }
});

test.describe('Protected routes (client portal)', () => {
  test('should redirect to the unified /login when accessing client projects without auth', async ({ page }) => {
    await page.goto('/client/projects');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should redirect to /login when accessing the asset viewer without auth', async ({ page }) => {
    await page.goto('/assets/some-id');
    await expect(page).toHaveURL(/.*login/);
  });
});
