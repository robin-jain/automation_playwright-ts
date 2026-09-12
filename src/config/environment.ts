import fs from 'node:fs';
import path from 'node:path';

export type TargetEnvironment = 'dev' | 'uat' | 'prod';

interface EnvironmentFile {
  name: TargetEnvironment;
  baseURL: string;
  loginPath: string;
  readOnly: boolean;
  captureStepScreenshots: boolean;
  navigationTimeoutMs: number;
  actionTimeoutMs: number;
}

export type AppConfig = EnvironmentFile;

const validEnvironments: TargetEnvironment[] = ['dev', 'uat', 'prod'];
const requiredKeys = [
  'APP_NAME',
  'BASE_URL',
  'LOGIN_PATH',
  'READ_ONLY',
  'CAPTURE_STEP_SCREENSHOTS',
  'NAVIGATION_TIMEOUT_MS',
  'ACTION_TIMEOUT_MS',
] as const;

function loadEnvironmentFile(targetEnvironment: TargetEnvironment): Record<string, string> {
  const filePath = path.join(process.cwd(), `.env.${targetEnvironment}`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Environment file not found: ${filePath}`);
  }

  const values: Record<string, string> = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const match = trimmedLine.match(/^(?:export\s+)?([^=\s]+)\s*=\s*(.*)$/);
    if (!match) {
      throw new Error(`Invalid environment variable declaration in ${filePath}: ${trimmedLine}`);
    }

    const [, key, rawValue] = match;
    const value = rawValue.trim().replace(/^("|')(.*)\1$/, '$2');
    values[key] = value;
    if (process.env[key] === undefined && !requiredKeys.includes(key as typeof requiredKeys[number])) {
      process.env[key] = value;
    }
  }

  return values;
}

function getTargetEnvironment(): TargetEnvironment {
  const value = process.env.TARGET_ENV ?? 'dev';
  if (!validEnvironments.includes(value as TargetEnvironment)) {
    throw new Error(`TARGET_ENV must be one of: ${validEnvironments.join(', ')}. Received: ${value}`);
  }
  return value as TargetEnvironment;
}

function getValue(key: string, fileValues: Record<string, string>): string {
  const value = process.env[key] ?? fileValues[key];
  if (value === undefined || value.trim() === '') {
    throw new Error(`Missing required environment setting: ${key}`);
  }
  return value.trim();
}

function parseBoolean(key: string, value: string): boolean {
  if (value !== 'true' && value !== 'false') {
    throw new Error(`${key} must be either true or false. Received: ${value}`);
  }
  return value === 'true';
}

function parseTimeout(key: string, value: string): number {
  if (!/^\d+$/.test(value)) {
    throw new Error(`${key} must be a positive integer. Received: ${value}`);
  }

  const timeout = Number(value);
  if (timeout <= 0) {
    throw new Error(`${key} must be greater than zero. Received: ${value}`);
  }
  return timeout;
}

function validateEnvironment(environment: EnvironmentFile): void {
  try {
    new URL(environment.baseURL);
  } catch {
    throw new Error(`Invalid baseURL for ${environment.name}: ${environment.baseURL}`);
  }

  if (!environment.loginPath.startsWith('/')) {
    throw new Error(`loginPath for ${environment.name} must start with '/'`);
  }
}

export function loadAppConfig(targetEnvironment = getTargetEnvironment()): AppConfig {
  const fileValues = loadEnvironmentFile(targetEnvironment);
  const environment: EnvironmentFile = {
    name: getValue('APP_NAME', fileValues) as TargetEnvironment,
    baseURL: getValue('BASE_URL', fileValues),
    loginPath: getValue('LOGIN_PATH', fileValues),
    readOnly: parseBoolean('READ_ONLY', getValue('READ_ONLY', fileValues)),
    captureStepScreenshots: parseBoolean(
      'CAPTURE_STEP_SCREENSHOTS',
      getValue('CAPTURE_STEP_SCREENSHOTS', fileValues),
    ),
    navigationTimeoutMs: parseTimeout(
      'NAVIGATION_TIMEOUT_MS',
      getValue('NAVIGATION_TIMEOUT_MS', fileValues),
    ),
    actionTimeoutMs: parseTimeout('ACTION_TIMEOUT_MS', getValue('ACTION_TIMEOUT_MS', fileValues)),
  };

  validateEnvironment(environment);
  if (environment.name !== targetEnvironment) {
    throw new Error(`Environment file name ${environment.name} does not match TARGET_ENV ${targetEnvironment}`);
  }

  return environment;
}
