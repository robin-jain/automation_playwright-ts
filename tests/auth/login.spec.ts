import { loadAppConfig } from '../../src/config/environment';
import { test } from '../../src/fixtures/test';
import { loadCredentials, loadTestCaseData } from '../../src/utils/testData';

test.describe('Authentication', () => {
  test('user can log in and log out @smoke @readonly', async ({
    loginPage,
    dashboardPage,
  }) => {
    const appConfig = loadAppConfig();
    const loginData = loadTestCaseData(appConfig, 'Test_case_001');
    const credentials = loadCredentials(loginData, 'Test_case_001');

    await test.step('Open the OrangeHRM login page', async () => {
      await loginPage.navigate(appConfig.loginPath);
    });
    await test.step('Submit valid credentials', async () => {
      await loginPage.login(credentials.username, credentials.password);
    });
    await test.step('Verify the dashboard is displayed', async () => {
      await dashboardPage.expectLoaded(loginData.expectedDashboard ?? 'Dashboard');
    });
    await test.step('Log out of OrangeHRM', async () => {
      await dashboardPage.logout();
    });
  });
});
