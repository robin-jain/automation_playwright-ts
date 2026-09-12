import { test as base, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';

export type FrameworkFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<FrameworkFixtures>({
  loginPage: async ({ page }, use, testInfo) => {
    await use(new LoginPage(page, testInfo));
  },
  dashboardPage: async ({ page }, use, testInfo) => {
    await use(new DashboardPage(page, testInfo));
  },
});

export { expect };
