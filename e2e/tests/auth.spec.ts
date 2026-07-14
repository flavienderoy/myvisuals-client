import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  test('should display the login page correctly', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.getByPlaceholder(/name@example|email/i);
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.getByRole('button', { name: /Se Connecter|Log in/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
  });

  test('should not navigate away on empty submission (required fields)', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('button', { name: /Se Connecter|Log in/i }).click();

    // Native `required` validation blocks the submit → we stay on /login
    await expect(page).toHaveURL(/.*login/);
  });

  test('should link to the signup page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: /Créer un compte/i })).toBeVisible();
  });
});
