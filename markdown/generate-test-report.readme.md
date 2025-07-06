# 🧦 JEST, 📕 Generate Test Report

## 1. Generate test coverage report

```bash
# Generate test coverage report 
yarn test:ci:cov      # Generate all test coverage report
yarn test:e2e:cov     # Generate e2e test coverage report
yarn test:unit:cov    # Generate unit test coverage report
```

👉 preview: <http://127.0.0.1:5500/coverage/lcov-report/index.html>

### 2. Generate all test report ( Unit and E2E Tests )

```bash
# Generate all test report ( Unit and E2E Tests )
yarn test:report          # Generate report for e2e and unit tests
yarn test:e2e:report      # Generate report for e2e test
yarn test:unit:report     # Generate report for unit test
```

### 3. Remove test report folder

```bash
yarn run remove:test:report
```

👉 preview: [Test Report (E2E and Unit)](http://127.0.0.1:5500/report/index.html)  
👉 preview: [Test Report (E2E)](http://127.0.0.1:5500/report/e2e/index.html)  
👉 preview: [Test Report (Unit)](http://127.0.0.1:5500/report/unit/index.html)
