---
name: writing-go-tests
description: Applies current Go testing best practices. Use when writing or modifying Go test files or advising on Go testing strategies.
---

# Go Testing Best Practices

Actionable testing guidelines for Go. For extended code examples and production system references, consult `go-unit-testing.md` (the companion command).

## When Working with Go Tests

### 1. Test Organisation
- Place test files alongside source code using `*_test.go` naming
- Use internal tests (same package) for unit testing unexported functions
- Use external tests (`package foo_test`) for integration testing and examples
- Split test files by functionality when they exceed 500-800 lines (e.g., `handler_auth_test.go`, `handler_validation_test.go`)

### 2. Table-Driven Testing
- **Prefer map-based tables over slice-based** for automatic unique test names
- Use descriptive test case names that appear in failure output

```go
tests := map[string]struct {
    input string
    want  []string
}{
    "simple case":      {"a/b/c", []string{"a", "b", "c"}},
    "trailing separator": {"a/b/c/", []string{"a", "b", "c"}},
}

for name, tt := range tests {
    t.Run(name, func(t *testing.T) {
        got := Split(tt.input)
        if diff := cmp.Diff(tt.want, got); diff != "" {
            t.Errorf("Split() mismatch (-want +got):\n%s", diff)
        }
    })
}
```

### 3. Concurrent Testing
- **Use `testing/synctest` for deterministic concurrent testing** (Go 1.24+)
- Eliminates flaky time-based tests, runs in microseconds instead of seconds
- For traditional parallel tests, always call `t.Parallel()` first in test functions

### 4. Assertions and Comparisons
- Use `cmp.Diff()` from `google/go-cmp` for complex comparisons
- Standard library is sufficient for simple tests
- Testify (103k+ importers) is the dominant third-party framework when richer assertions are needed

### 5. Mocking and Test Doubles
- **Favour integration testing with real dependencies** over heavy mocking
- Use Testcontainers for database/service integration tests
- When mocking is necessary, prefer simple function-based test doubles:

```go
type TestDoubleUserRepo struct {
    GetUserFn func(ctx context.Context, id string) (*User, error)
}

func (t *TestDoubleUserRepo) GetUser(ctx context.Context, id string) (*User, error) {
    if t.GetUserFn != nil {
        return t.GetUserFn(ctx, id)
    }
    return nil, nil
}
```

### 6. Coverage Targets
- Aim for **70-80% coverage** as a practical target
- Focus on meaningful tests over percentage metrics
- Use `go test -cover` and `go tool cover -html` for analysis

### 7. Test Fixtures
- Use `testdata` directory for test fixtures (automatically ignored by Go toolchain)
- Implement golden file testing for validating complex output:

```go
goldenFile := "testdata/golden/expected_output.json"
if *update {
    os.WriteFile(goldenFile, []byte(result), 0644)
}
expected, _ := os.ReadFile(goldenFile)
assert.Equal(t, string(expected), result)
```

### 8. Helpers and Cleanup
- **Always mark helper functions with `t.Helper()`** for accurate error reporting
- Use `t.Cleanup()` for resource cleanup (superior to defer in tests):

```go
func setupDatabase(t *testing.T) *sql.DB {
    t.Helper()
    db, _ := sql.Open("sqlite3", ":memory:")
    t.Cleanup(func() { db.Close() })
    return db
}
```

### 9. Benchmarking (Go 1.24+)
- **Use `B.Loop()` method** as the preferred pattern (prevents compiler optimisations):

```go
func BenchmarkNew(b *testing.B) {
    // setup excluded from timing
    for b.Loop() {
        // measured code
    }
    // cleanup excluded from timing
}
```

### 10. Naming Conventions
- Test functions: `Test*`, `Benchmark*`, `Fuzz*`, `Example*` (capital letter after prefix)
- Use `got` and `want` for actual vs expected values
- Use descriptive test case names in table-driven tests

## Integration vs Unit Testing

- **Separate tests by environment variable** (preferred over build tags):

```go
if os.Getenv("INTEGRATION") == "" {
    t.Skip("skipping integration test")
}
```

## Dependency Injection Pattern

```go
func NewUserService(repo UserRepository, logger Logger) *UserService {
    return &UserService{repo: repo, logger: logger}
}
```

Interface-based design ("accept interfaces, return structs") enables clean testing boundaries.

## Key Principle

**Focus on meaningful tests that validate behaviour rather than implementation.** Pragmatic excellence over theoretical perfection.
