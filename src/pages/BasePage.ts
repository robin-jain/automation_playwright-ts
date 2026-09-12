import type { Page, TestInfo } from '@playwright/test';
import { loadAppConfig } from '../config/environment';
import { UiActions } from '../utils/UiActions';

export abstract class BasePage {
  protected readonly uiActions: UiActions;

  constructor(
    protected readonly page: Page,
    testInfo: TestInfo,
  ) {
    this.uiActions = new UiActions(page, testInfo, loadAppConfig());
  }

  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
