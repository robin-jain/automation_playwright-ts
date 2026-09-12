import type { Locator, Page, TestInfo } from '@playwright/test';
import type { AppConfig } from '../config/environment';
import { takeStepScreenshot } from './step';

export class UiActions {
  private stepNumber = 0;

  constructor(
    private readonly page: Page,
    private readonly testInfo: TestInfo,
    private readonly appConfig: AppConfig,
  ) {}

  private async capture(name: string): Promise<void> {
    if (!this.appConfig.captureStepScreenshots) {
      return;
    }

    this.stepNumber += 1;
    await takeStepScreenshot(this.page, this.testInfo, this.stepNumber, name);
  }

  async click(locator: Locator, name = 'Click'): Promise<void> {
    await locator.click();
    await this.capture(name);
  }

  async fill(locator: Locator, value: string, name = 'Fill'): Promise<void> {
    await locator.fill(value);
    await this.capture(name);
  }

  async goTo(url: string, name = 'Navigate'): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
    await this.capture(name);
  }

  async selectOption(locator: Locator, value: string, name = 'Select option'): Promise<void> {
    await locator.selectOption(value);
    await this.capture(name);
  }

  async check(locator: Locator, name = 'Check'): Promise<void> {
    await locator.check();
    await this.capture(name);
  }

  async uncheck(locator: Locator, name = 'Uncheck'): Promise<void> {
    await locator.uncheck();
    await this.capture(name);
  }

  async press(locator: Locator, key: string, name = `Press ${key}`): Promise<void> {
    await locator.press(key);
    await this.capture(name);
  }
}