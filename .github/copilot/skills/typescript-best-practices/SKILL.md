# TypeScript: Avoiding `any` for Safer Code

## Why Avoid `any`?
- Using `any` disables type checking, making your code less safe and maintainable.
- It hides potential bugs and reduces editor IntelliSense.
- It can lead to runtime errors that could have been caught at compile time.

## What to Use Instead
- **Prefer specific interfaces** for known data shapes.
- For generic objects (like form data or API responses), use `Record<string, unknown>`.
- For arrays, use `unknown[]` or a specific type (e.g., `User[]`).
- Use union types for limited sets of values (e.g., `'active' | 'inactive'`).
- Use `unknown` for truly unknown types, then narrow them with type guards.

## Example: Refactoring Props

**Bad:**
```tsx
interface Props {
  value: any;
  onBack: () => void;
}
```

**Good:**
```tsx
interface Props {
  value: Record<string, unknown>; // or a specific interface
  onBack: () => void;
}
```

## Practical Example: Form Data in React Components

When working with form data in React components (e.g., Inertia.js forms), replace `any` with `Record<string, unknown>`:

**Before:**
```tsx
const [formData, setFormData] = useState<any>({});
```

**After:**
```tsx
const [formData, setFormData] = useState<Record<string, unknown>>({});
```

However, `Record<string, unknown>` can cause type errors when accessing properties as strings. Cast to `String()` for string operations:

```tsx
// If you need to treat a value as a string
const displayName = String(formData.name || '');
```

## Common Pitfalls and Fixes

### Pitfall: Type Errors with Record<string, unknown>
When using `Record<string, unknown>`, TypeScript may complain about assignments to string-typed variables.

**Fix:** Use `String()` casting for string contexts:
```tsx
const [firstName, setFirstName] = useState(String(formData.firstName || ''));
```

### Pitfall: Overusing Record<string, unknown>
Don't use it everywhere—define specific interfaces when possible for better type safety.

**Better Approach:**
```tsx
interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
}

const [formData, setFormData] = useState<UserFormData>({
  firstName: '',
  lastName: '',
  email: '',
});
```

## When to Use `unknown`
- Use `unknown` when you truly do not know the type, and always narrow it before use.
- Narrow with type guards or assertions:
```tsx
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

if (isString(someValue)) {
  // Now TypeScript knows someValue is a string
}
```

## References
- [TypeScript no-explicit-any rule](https://typescript-eslint.io/rules/no-explicit-any/)
- [TypeScript Handbook: Any](https://www.typescriptlang.org/docs/handbook/basic-types.html#any)
- [TypeScript Handbook: Unknown](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type)
