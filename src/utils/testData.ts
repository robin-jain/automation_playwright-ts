import fs from 'node:fs';
import path from 'node:path';
import type { AppConfig } from '../config/environment';

export interface TestCaseData {
  name?: string;
  lastName?: string;
  usernameEnv?: string;
  passwordEnv?: string;
  expectedDashboard?: string;
  expectedUrl?: string;
  [key: string]: string | undefined;
}

export interface Credentials {
  username: string;
  password: string;
}

function loadAllTestData(config: AppConfig): Record<string, TestCaseData> {
  const filePath = path.join(process.cwd(), 'test-data', `testdata_${config.name}.json`);
  const testData = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, TestCaseData>;

  if (Object.keys(testData).length === 0) {
    throw new Error(`No test cases found in testdata_${config.name}.json`);
  }

  return testData;
}

export function loadTestCaseData(config: AppConfig, testCaseKey: string): TestCaseData {
  const testCase = loadAllTestData(config)[testCaseKey];
  if (!testCase || Object.keys(testCase).length === 0) {
    throw new Error(`Test case ${testCaseKey} was not found or is empty for environment ${config.name}`);
  }
  return testCase;
}

export function loadCredentials(testCase: TestCaseData, testCaseKey: string): Credentials {
  if (!testCase.usernameEnv || !testCase.passwordEnv) {
    throw new Error(`Test case ${testCaseKey} must define usernameEnv and passwordEnv for login tests`);
  }

  const username = process.env[testCase.usernameEnv];
  const password = process.env[testCase.passwordEnv];
  if (!username || !password) {
    throw new Error(
      `Missing credentials. Set ${testCase.usernameEnv} and ${testCase.passwordEnv} before running login tests.`,
    );
  }

  return { username, password };
}