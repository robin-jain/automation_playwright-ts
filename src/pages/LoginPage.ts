import { expect, type Page, type TestInfo } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.getByRole('textbox', { name: /username/i });
  private readonly passwordInput = this.page.getByRole('textbox', { name: /password/i });
  private readonly loginButton = this.page.getByRole('button', { name: /login/i });
  private readonly loginError = this.page.locator('.oxd-alert-content-text');

  constructor(page: Page, testInfo: TestInfo) {
    super(page, testInfo);
  }

  async navigate(loginPath: string): Promise<void> {
    await this.uiActions.goTo(loginPath, 'Navigate to the OrangeHRM login page');
  }

  async login(username: string, password: string): Promise<void> {
    await this.uiActions.fill(this.usernameInput, username, 'Fill username');
    await this.uiActions.fill(this.passwordInput, password, 'Fill password');
    await this.uiActions.click(this.loginButton, 'Click Login');
  }

  async expectLoginError(): Promise<void> {
    await expect(this.loginError).toBeVisible();
  }
}
