# TypeScript Utilities Documentation

This project includes comprehensive TypeScript utilities to improve type safety and developer experience.

## Files Overview

### lib/types.ts
Contains core type definitions:
- **PageProps<T>**: Type-safe props for Next.js pages
- **RouteContext<T>**: Typed context for API route handlers
- **FormChangeHandler**: Typed event handlers for forms
- **Utility Types**: PartialBy, RequiredBy, KeysOfType, etc.
- **Type Guards**: isDefined, isNonEmptyString, isError

### lib/validation.ts
Validation utilities for:
- Appointment status validation
- Date validation and comparison
- Page number and page size validation
- Duration validation
- String sanitization

### lib/constants.ts
Typed constants for:
- Pagination defaults
- API configuration
- Date formatting
- Form constraints
- HTTP status codes
- Environment variables

### lib/utils.ts
DOM and React utilities:
- classNames: Combine CSS classes
- debounce/throttle: Performance optimization
- localStorage helpers: Type-safe storage
- copyToClipboard: Clipboard operations
- formatCurrency/formatFileSize: Formatting utilities

## Usage Examples

### Type-safe Page Props
```typescript
import { PageProps } from '@/lib/types';

export default async function Page(props: PageProps<'/appointments/[id]'>) {
  const { id } = await props.params;
  // id is typed as string
}
```

### API Route with Typed Context
```typescript
import { RouteContext, ErrorResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  context: RouteContext<{ id: string }>
): Promise<NextResponse<Data | ErrorResponse>> {
  const { id } = await context.params;
  // ...
}
```

### Form Handler
```typescript
import { FormChangeHandler } from '@/lib/types';

const handleChange = (e: FormChangeHandler) => {
  const { name, value } = e.target;
  // Works with input, textarea, and select
};
```

### Validation
```typescript
import { isValidAppointmentStatus, isValidDateRange } from '@/lib/validation';

if (isValidAppointmentStatus(status)) {
  // status is typed as AppointmentStatus
}

if (!isValidDateRange(start, end)) {
  throw new Error('End must be after start');
}
```

### Constants
```typescript
import { PAGINATION_DEFAULTS, API_CONFIG } from '@/lib/constants';

const pageSize = PAGINATION_DEFAULTS.PAGE_SIZE; // 12
const timeout = API_CONFIG.DEFAULT_TIMEOUT_MS; // 15000
```

### Utilities
```typescript
import { classNames, debounce } from '@/lib/utils';

const className = classNames(
  'base-class',
  isActive && 'active',
  'another-class'
); // 'base-class active another-class'

const debouncedSearch = debounce(handleSearch, 300);
```

## Benefits

1. **Type Safety**: Catch errors at compile time instead of runtime
2. **Better IDE Support**: Auto-completion and inline documentation
3. **Code Reusability**: Shared utilities across the project
4. **Consistency**: Standardized patterns and conventions
5. **Documentation**: JSDoc comments provide context
6. **Maintainability**: Easier to understand and modify code
