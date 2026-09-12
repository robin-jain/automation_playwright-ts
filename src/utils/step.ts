import type { Page, TestInfo } from '@playwright/test';

function toFileName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function takeStepScreenshot(
  page: Page,
  testInfo: TestInfo,
  stepNumber: number,
  name: string,
): Promise<void> {
  const screenshotPath = testInfo.outputPath(
    'screenshots',
    `step-${stepNumber}-${toFileName(name)}.png`,
  );

  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  await testInfo.attach(`Step ${stepNumber}: ${name}`, {
    path: screenshotPath,
    contentType: 'image/png',
  });
}
