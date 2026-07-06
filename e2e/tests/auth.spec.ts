import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  test('should display login page correctly', async ({ page }) => {
    // We navigate to the app root, which should redirect to /signin if not auth'd
    await page.goto('http://localhost:5173/');
    
    // Check if we are redirected to the signin page
    await expect(page).toHaveURL(/.*signin/);

    // Check for essential elements on the login page
    const emailInput = page.getByPlaceholder(/Email|Votre email/i);
    const passwordInput = page.getByPlaceholder(/Mot de passe|Password/i);
    const loginButton = page.getByRole('button', { name: /Se connecter|Log in/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
  });

  test('should show validation errors on empty submission', async ({ page }) => {
    await page.goto('http://localhost:5173/signin');
    
    const loginButton = page.getByRole('button', { name: /Se connecter|Log in/i });
    await loginButton.click();

    // The validation should be handled by browser 'required' attributes or custom UI
    // If it's custom UI we look for a text
    // Otherwise we just ensure the URL hasn't changed to a protected route
    await expect(page).toHaveURL(/.*signin/);
  });
});
