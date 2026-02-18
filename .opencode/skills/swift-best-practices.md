---
name: swift-best-practices
description: Use when writing or reviewing Swift code for iOS or macOS projects. Apply modern Swift 6+ best practices, concurrency patterns, API design guidelines, and migration strategies. Covers async/await, actors, MainActor, Sendable, typed throws, and Swift 6 breaking changes.
---

# Swift Best Practices

Modern Swift development for iOS and macOS projects targeting Swift 6+.

## When to Use This Skill

- Writing new Swift code for iOS or macOS applications
- Reviewing Swift code for correctness, safety, and style
- Implementing Swift concurrency features (async/await, actors, MainActor)
- Designing Swift APIs and public interfaces
- Migrating code from Swift 5 to Swift 6
- Addressing concurrency warnings, data race issues, or Sendable/isolation errors

## Core Guidelines

### Fundamental Principles

1. **Clarity at point of use** is paramount — evaluate designs by examining use cases, not just declarations
2. **Clarity over brevity** — compact code comes from the type system, not minimal characters
3. **Write documentation for every public declaration** — if you can't describe functionality simply, the API may be poorly designed
4. **Name by role, not type** — `var greeting = "Hello"` not `var string = "Hello"`
5. **Favour elegance through simplicity** — avoid over-engineering unless complexity genuinely warrants it

### Swift 6 Concurrency Model

Swift 6 enables complete concurrency checking by default with region-based isolation (SE-0414). The compiler now proves code safety, eliminating many false positives whilst catching real concurrency issues at compile time.

**Critical understanding:**
- **Async ≠ background** — async functions can suspend but don't automatically run on background threads
- Actors protect mutable shared state through automatic synchronisation
- `@MainActor` ensures UI-related code executes on the main thread
- Global actor-isolated types are automatically `Sendable`

### Essential Patterns

#### Async/Await
```swift
// Parallel execution with async let
func fetchData() async -> (String, Int) {
    async let stringData = fetchString()
    async let intData = fetchInt()
    return await (stringData, intData)
}

// Always check cancellation in long-running operations
func process(_ items: [Item]) async throws -> [Result] {
    var results: [Result] = []
    for item in items {
        try Task.checkCancellation()
        results.append(await process(item))
    }
    return results
}
```

#### MainActor for UI Code
```swift
@MainActor
class ContentViewModel: ObservableObject {
    @Published var images: [UIImage] = []

    func fetchData() async throws {
        self.images = try await fetchImages()
    }
}

// Avoid MainActor.run when direct await works
await doMainActorStuff()  // Good
await MainActor.run { doMainActorStuff() }  // Unnecessary
```

#### Actor Isolation
```swift
actor DataCache {
    private var cache: [String: Data] = [:]

    func store(_ data: Data, forKey key: String) {
        cache[key] = data
    }

    nonisolated func cacheType() -> String {
        return "DataCache"
    }
}
```

### Common Pitfalls to Avoid

1. **Don't mark functions as `async` unnecessarily** — async calling convention has overhead
2. **Never use `DispatchSemaphore` with async/await** — risk of deadlock
3. **Don't create stateless actors** — use non-isolated async functions instead
4. **Avoid split isolation** — don't mix isolation domains within one type
5. **Check task cancellation** — long operations must check `Task.checkCancellation()`
6. **Don't assume async means background** — explicitly move work to background if needed

### API Design Quick Reference

#### Naming Conventions
- Types/protocols: `UpperCamelCase`
- Everything else: `lowerCamelCase`
- Protocols describing capabilities: `-able`, `-ible`, `-ing` suffixes (`Equatable`, `ProgressReporting`)
- Factory methods: Begin with `make` (`x.makeIterator()`)
- Mutating pairs: imperative vs past participle (`x.sort()` / `x.sorted()`)

#### Method Naming by Side Effects
- No side effects: Noun phrases (`x.distance(to: y)`)
- With side effects: Imperative verbs (`x.append(y)`, `x.sort()`)

#### Argument Labels
- Omit when arguments can't be distinguished: `min(number1, number2)`
- Value-preserving conversions omit first label: `Int64(someUInt32)`
- Prepositional phrases label at preposition: `x.removeBoxes(havingLength: 12)`

### Swift 6 Breaking Changes

#### Must Explicitly Mark Types with @MainActor (SE-0401)
Property wrappers no longer infer actor isolation automatically.
```swift
@MainActor
struct LogInView: View {
    @StateObject private var model = ViewModel()
}
```

#### Global Variables Must Be Concurrency-Safe (SE-0412)
```swift
static let config = Config()                         // Constant - OK
@MainActor static var state = State()                // Actor-isolated - OK
nonisolated(unsafe) var cache = [String: Data]()     // Unsafe - use with caution
```

#### Other Changes
- `@UIApplicationMain`/`@NSApplicationMain` deprecated (use `@main`)
- `any` required for existential types
- Import visibility requires explicit access control

### API Availability Patterns

```swift
@available(macOS 15, iOS 18, *)
func modernAPI() { }

@available(*, deprecated, message: "Use newMethod() instead")
func oldMethod() { }

@available(*, unavailable, renamed: "newMethod")
func oldMethod() { }

if #available(iOS 18, *) {
    // iOS 18+ code
}

if #unavailable(iOS 18, *) {
    // iOS 17 and lower
}
```

**Key differences:**
- `deprecated` — Warning, allows usage
- `obsoleted` — Error from specific version
- `unavailable` — Error, completely prevents usage

## Code Quality Standards

- Minimise comments — code should be self-documenting where possible
- Avoid over-engineering and unnecessary abstractions
- Prefer `count(where:)` over `filter().count`
- Use `InlineArray` for fixed-size, performance-critical data (Swift 6.2+)
- Trust compiler's concurrency flow analysis — avoid unnecessary `Sendable` conformances

## Platform Requirements

- Swift 6.0+ compiler for Swift 6 features
- Swift 6.2+ for InlineArray and enhanced concurrency features
- macOS 15.7+ with appropriate SDK
- Use `#available` for runtime platform detection
- Use `@available` for API availability marking
