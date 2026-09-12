import { loadAppConfig } from '../../src/config/environment';
import { test } from '../../src/fixtures/test';
import { loadCredentials, loadTestCaseData } from '../../src/utils/testData';

test.describe('Dashboard', () => {
  test('authenticated user can view the dashboard @smoke @readonly', async ({
    loginPage,
    dashboardPage,
  }) => {
    const appConfig = loadAppConfig();
    const dashboardData = loadTestCaseData(appConfig, 'Test_case_001');
    const credentials = loadCredentials(dashboardData, 'Test_case_001');

    await test.step('Open the OrangeHRM login page', async () => {
      await loginPage.navigate(appConfig.loginPath);
    });
    await test.step('Sign in with the environment account', async () => {
      await loginPage.login(credentials.username, credentials.password);
    });
    await test.step('Verify dashboard content', async () => {
      await dashboardPage.expectLoaded(dashboardData.expectedDashboard ?? 'Dashboard');
    });
  });
});
