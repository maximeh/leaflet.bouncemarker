/**
 * Playwright test runner for Leaflet BounceMarker
 * Runs integration tests in a real browser and reports results
 */

const { chromium } = require('playwright');
const path = require('path');

async function runTests() {
  console.log('Starting Leaflet BounceMarker tests...\n');

  // Launch browser
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Browser error:', msg.text());
    }
  });

  try {
    // Load test page
    const testFile = path.join(__dirname, 'integration.test.html');
    await page.goto(`file://${testFile}`);

    // Wait for tests to complete (look for testResults on window)
    await page.waitForFunction(() => window.testResults !== undefined, { timeout: 30000 });

    // Get test results
    const results = await page.evaluate(() => window.testResults);

    // Print results
    console.log('Test Results:');
    console.log('='.repeat(50));

    for (const result of results.results) {
      const symbol = result.status === 'pass' ? '✓' : '✗';
      const color = result.status === 'pass' ? '\x1b[32m' : '\x1b[31m';
      const reset = '\x1b[0m';

      console.log(`${color}${symbol} ${result.name}${reset}`);
      if (result.error) {
        console.log(`  ${result.error}`);
      }
    }

    console.log('='.repeat(50));
    console.log(`\n${results.passed}/${results.total} tests passed`);

    if (results.failed > 0) {
      console.log(`\n${results.failed} test(s) failed`);
    }

    await browser.close();

    // Exit with appropriate code
    process.exit(results.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('Test runner error:', error);
    await browser.close();
    process.exit(1);
  }
}

runTests();
