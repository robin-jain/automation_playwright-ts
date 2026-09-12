# OrangeHRM Playwright Framework

Enterprise-oriented Playwright automation framework using TypeScript, fixtures, Page Object Model, environment-specific dotenv files, and per-step screenshots.

## Setup

```bash
npm install
npx playwright install chromium
```

Set credentials in the shell or CI secret store. The local `.env.<target>` files may contain placeholders, but real credentials should remain external:

```bash
export ORANGEHRM_USERNAME=Admin
export ORANGEHRM_PASSWORD=your-password
```

Local environment files are loaded automatically from `.env.dev`, `.env.uat`, or `.env.prod` based on `TARGET_ENV`:

```text
.env.dev
.env.uat
.env.prod
```

Use `.env.example` as the template. Each `.env.<target>` file contains the complete non-secret application configuration. Shell and CI variables take precedence over values from local files.

Custom step screenshots are enabled in dev and UAT and disabled in prod through `CAPTURE_STEP_SCREENSHOTS`. Playwright's built-in failure screenshots remain controlled by `use.screenshot` in `playwright.config.ts`.

## Run

```bash
npm run typecheck
npm run test:dev
npm run test:smoke
npm run test:prod
npm run test:report
```

Select an environment with `TARGET_ENV=dev`, `TARGET_ENV=uat`, or `TARGET_ENV=prod`. Test commands always run Chromium in headed mode. The environment files use the public OrangeHRM demo host and must be replaced with approved deployment URLs before UAT or production execution.

Test data is stored in one file per environment:

```text
test-data/testdata_dev.json
test-data/testdata_uat.json
test-data/testdata_prod.json
```

Each file is keyed by test-case name. For example, `testData.Test_case_001` selects the `Test_case_001` data set. JSON contains the corresponding test input values and secret variable names; secret values remain in environment variables or CI secrets. Fields are optional so a case can contain only the values needed by that test.

All Page Objects are created by `src/fixtures/test.ts`; test files should consume fixtures rather than instantiate pages directly. Named steps create screenshots in each test's Playwright output directory. Production tests are tagged `@readonly` and should run only with protected CI credentials and approval.
# automation_playwright-ts
