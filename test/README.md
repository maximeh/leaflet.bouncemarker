# Leaflet BounceMarker Tests

Automated integration tests for the leaflet.bouncemarker library.

## Setup

Install dependencies (including Playwright):

```bash
npm install
```

Install Playwright browsers (one-time setup):

```bash
npx playwright install chromium
```

## Running Tests

Run all tests:

```bash
npm test
```

This will:
1. Launch a headless Chrome browser
2. Load the integration test page
3. Run all tests
4. Report results to console
5. Exit with code 0 (pass) or 1 (fail)

## Test Coverage

### Integration Tests (`integration.test.html`)

Tests run in a real browser with actual Leaflet maps:

- ✓ Marker has bounce method
- ✓ Marker has stopBounce method
- ✓ Marker can be created with bounceOnAdd option
- ✓ Marker bounces when added with bounceOnAdd
- ✓ Marker creates wrapper container during bounce
- ✓ Marker maintains position during pan
- ✓ Marker maintains position during zoom
- ✓ Shadow animates during bounce
- ✓ stopBounce removes animation classes
- ✓ Bounce callback is called
- ✓ Multiple markers can bounce simultaneously
- ✓ Marker can bounce multiple times (e.g., click after bounceOnAdd)

## CI/CD Integration

The tests can be integrated into CI pipelines:

```yaml
# GitHub Actions example
- name: Run tests
  run: npm test
```

Exit codes:
- `0` = All tests passed
- `1` = One or more tests failed

## Manual Testing

You can also open `test/integration.test.html` directly in a browser to see tests run with visual feedback.
