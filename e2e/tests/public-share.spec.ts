import { test, expect } from '@playwright/test';

test.describe('Public share link', () => {
  test('is reachable without auth (no redirect to /login)', async ({ page }) => {
    await page.goto('/share/nonexistent-token');
    await expect(page).not.toHaveURL(/.*login/);
    await expect(page).toHaveURL(/.*\/share\//);
  });

  test('shows a clear "unavailable" state for an invalid token', async ({ page }) => {
    await page.goto('/share/nonexistent-token');
    // Whether the API rejects the token or is unreachable, the page must
    // resolve to the friendly error state, never a blank screen.
    await expect(page.getByText(/indisponible/i)).toBeVisible({ timeout: 10000 });
  });
});
