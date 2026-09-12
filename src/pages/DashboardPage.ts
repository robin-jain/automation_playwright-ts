import { expect, type Page, type TestInfo } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  private readonly dashboardHeading = this.page.getByRole('heading', { name: /dashboard/i });
  private readonly userMenu = this.page.locator('.oxd-userdropdown-tab');
  private readonly logoutLink = this.page.getByRole('menuitem', { name: /logout/i });

  constructor(page: Page, testInfo: TestInfo) {
    super(page, testInfo);
  }

  async expectLoaded(heading = 'Dashboard'): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.dashboardHeading).toHaveText(heading);
  }

  async logout(): Promise<void> {
    await this.uiActions.click(this.userMenu, 'Open user menu');
    await this.uiActions.click(this.logoutLink, 'Click Logout');
  }
}
