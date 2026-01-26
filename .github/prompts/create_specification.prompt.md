---
agent: 'agent'
description: 'Create a new specification file for the solution, optimized for Generative AI consumption.'
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'web', 'copilot-container-tools/*', 'agent', 'gitkraken/*', 'ms-vscode.vscode-websearchforcopilot/websearch', 'todo']
---

# Laravel 12 + React Specification Template

# Create a Laravel Specification File

Your goal is to create a new specification file for `${input:SpecPurpose}` in a Laravel 12 application with React (Inertia.js) frontend.

The specification must define requirements, constraints, and interfaces following Laravel best practices, SOLID principles, and patterns that prevent common anti-patterns (fat controllers, business logic in views, etc.).

## Laravel-Specific Best Practices for AI-Ready Specifications

### General Principles
- Use precise, explicit language aligned with Laravel conventions
- Clearly distinguish between requirements, constraints, and recommendations
- Reference Laravel framework components by their correct names (Service Providers, Middleware, Eloquent Models, etc.)
- Follow PSR-12 coding standards and Laravel naming conventions
- Include service layer architecture when business logic is involved
- Specify whether to use Eloquent ORM or Query Builder
- Define validation rules using Laravel's validation syntax

### Code Organization
- Controllers MUST only handle HTTP concerns (validation, responses, redirects)
- Business logic MUST be in Service classes (`app/Services/`)
- Single-purpose operations SHOULD use Action classes (`app/Actions/`)
- Complex validation MUST use Form Request classes (`app/Http/Requests/`)
- Reusable validation logic MUST use Custom Rule classes (`app/Rules/`)
- Model-specific logic MUST be in Eloquent Models
- Shared behavior across models SHOULD use Traits (`app/Traits/`)

### Frontend (React + Inertia.js)
- Define props contracts for Inertia components
- Specify form validation approach (client-side + server-side)
- Define shared component structure
- Specify TypeScript usage (if applicable)

### Database & Models
- Define Eloquent relationships explicitly
- Specify migration structure and constraints
- Define model accessors, mutators, and scopes
- Specify whether soft deletes are required
- Define model events and observers if needed

The specification should be saved in `/spec/` directory and named: `spec-[category]-[feature-name].md`

**Categories:** `architecture`, `feature`, `api`, `database`, `security`, `infrastructure`, `integration`

**Example:** `spec-feature-tenant-subscription-management.md`

---

## Specification Template

```md
---
title: '[Feature/Component Name] - Laravel 12 Specification'
version: '1.0.0'
date_created: '[YYYY-MM-DD]'
last_updated: '[YYYY-MM-DD]'
owner: '[Team/Individual]'
framework: 'Laravel 12 + React (Inertia.js)'
description: '[Brief summary of what this spec covers]'
tags: ['laravel', 'react', 'inertia', '[domain-tag]', '[feature-tag]']
related_features: ['[Related Feature 1]', '[Related Feature 2]']
---

# [Feature/Component Name]

## 1. Purpose & Scope

### Purpose
[Clear description of what this feature/component does and why it exists]

### Scope
**In Scope:**
- [What is included]
- [What functionality is covered]

**Out of Scope:**
- [What is explicitly not included]
- [What will be addressed in future iterations]

### Intended Audience
- Backend Developers (Laravel)
- Frontend Developers (React)
- AI Copilots
- QA Engineers

### Assumptions
- Laravel 12.x is installed and configured
- Inertia.js is set up with React adapter
- Database is MySQL 8.0+ or PostgreSQL 13+
- Node.js 20+ and npm/pnpm/yarn is available

---

## 2. Definitions & Acronyms

| Term | Definition |
|------|------------|
| **Service** | A class in `app/Services/` containing business logic |
| **Action** | A single-purpose class in `app/Actions/` performing one operation |
| **Form Request** | A validation class extending `Illuminate\Foundation\Http\FormRequest` |
| **Inertia Component** | React component in `resources/js/Pages/` rendered by Inertia.js |
| **Shared Component** | Reusable React component in `resources/js/Components/` |
| **[Custom Term]** | [Definition] |

---

## 3. Architecture Overview

### Layer Responsibilities

```
┌─────────────────────────────────────────────────┐
│  Frontend (React + Inertia.js)                  │
│  - User interface and interactions              │
│  - Form validation (client-side)                │
│  - State management (React hooks)               │
└─────────────────┬───────────────────────────────┘
                  │ HTTP/Inertia
┌─────────────────▼───────────────────────────────┐
│  Controllers (app/Http/Controllers/)            │
│  - HTTP request/response handling               │
│  - Delegate to Services                         │
│  - Return Inertia responses                     │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│  Services (app/Services/)                       │
│  - Business logic                               │
│  - Orchestrate multiple operations              │
│  - Database transactions                        │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│  Models (app/Models/)                           │
│  - Data access layer                            │
│  - Relationships                                │
│  - Scopes, accessors, mutators                  │
└─────────────────────────────────────────────────┘
```

### File Structure
```
app/
├── Http/
│   ├── Controllers/
│   │   └── [Feature]Controller.php
│   ├── Requests/
│   │   ├── Store[Feature]Request.php
│   │   └── Update[Feature]Request.php
│   └── Middleware/
│       └── [CustomMiddleware].php
├── Services/
│   └── [Feature]Service.php
├── Actions/
│   └── [Feature]/
│       └── [SpecificAction].php
├── Models/
│   └── [Model].php
├── Rules/
│   └── [CustomValidationRule].php
├── Traits/
│   └── [BehaviorTrait].php
├── Events/
│   └── [Event].php
├── Listeners/
│   └── [Listener].php
└── Notifications/
    └── [Notification].php

resources/
└── js/
    ├── Pages/
    │   └── [Feature]/
    │       ├── Index.jsx
    │       ├── Show.jsx
    │       ├── Create.jsx
    │       └── Edit.jsx
    ├── Components/
    │   └── [SharedComponent].jsx
    └── Layouts/
        └── [Layout].jsx
```

---

## 4. Requirements

### Functional Requirements

#### Backend Requirements

**REQ-001**: Controller Structure
- Controllers MUST only handle HTTP concerns
- Controllers MUST NOT contain business logic
- Controllers MUST delegate to Service classes
- Controller methods MUST be under 25 lines

**REQ-002**: Service Layer
- Complex operations MUST use Service classes
- Services MUST handle database transactions
- Services MUST be in `app/Services/` namespace
- Services MUST use dependency injection

**REQ-003**: Validation
- All input MUST be validated
- Complex validation MUST use Form Request classes
- Custom validation logic MUST use Rule classes
- Validation rules MUST be defined in Request classes

**REQ-004**: Model Requirements
- Models MUST define all relationships
- Models MUST use appropriate casts
- Models MUST define fillable or guarded properties
- Business logic specific to a model MUST be in the Model class

**REQ-005**: Database
- All schema changes MUST use migrations
- Foreign keys MUST be defined with proper constraints
- Indexes MUST be added for frequently queried columns
- Migration file names MUST follow Laravel conventions

#### Frontend Requirements

**REQ-006**: Inertia Components
- All pages MUST be in `resources/js/Pages/[Feature]/`
- Shared components MUST be in `resources/js/Components/`
- Props MUST be typed (TypeScript) or documented (JSDoc)
- Forms MUST handle validation errors from Laravel

**REQ-007**: Form Handling
- Forms MUST use Inertia's form helper
- Forms MUST display server-side validation errors
- Forms MUST show loading states during submission
- Forms MUST handle success/error responses

**REQ-008**: State Management
- Use React hooks for local state
- Use Inertia's shared data for global state
- Avoid prop drilling beyond 2 levels

### Non-Functional Requirements

**NFR-001**: Performance
- Database queries MUST use eager loading to prevent N+1
- List pages MUST implement pagination
- Heavy operations MUST use queued jobs

**NFR-002**: Security
- All routes MUST be protected with appropriate middleware
- Authorization MUST use Laravel Policies
- Mass assignment MUST be prevented via fillable/guarded
- CSRF protection MUST be enabled for all forms

**NFR-003**: Code Quality
- All code MUST follow PSR-12 standards
- All public methods MUST have return type declarations
- All complex methods MUST have docblocks
- No method should have cyclomatic complexity > 10

---

## 5. Constraints

**CON-001**: Technology Stack
- MUST use Laravel 12.x
- MUST use React 18+ with Inertia.js
- MUST use MySQL 8.0+ or PostgreSQL 13+
- MUST use Tailwind CSS for styling

**CON-002**: Laravel Best Practices
- MUST NOT use static methods for business logic
- MUST NOT put business logic in Blade templates or React components
- MUST NOT use DB::raw() without proper parameter binding
- MUST NOT bypass Eloquent ORM without documented reason

**CON-003**: Code Organization
- Controllers MUST NOT exceed 200 lines
- Service classes MUST NOT exceed 300 lines
- React components MUST NOT exceed 250 lines
- Extract complex logic into smaller classes/functions

**CON-004**: File Storage
- NEVER use localStorage or sessionStorage in Inertia components
- Use Laravel session for server-side storage
- Use Inertia shared props for cross-page data
- Use React state for temporary UI state only

---

## 6. Guidelines

**GUI-001**: Naming Conventions
- Controllers: `[Singular]Controller` (e.g., `UserController`)
- Services: `[Feature]Service` (e.g., `TenantCreationService`)
- Actions: `[Verb][Noun]` (e.g., `CreateTenantWithResources`)
- Models: `[Singular]` (e.g., `User`, `Subscription`)
- Form Requests: `[Action][Model]Request` (e.g., `StoreUserRequest`)
- Rules: `[Descriptive]` (e.g., `UniqueTenantDomain`)

**GUI-002**: Error Handling
- Use try-catch in controllers only for logging
- Use Laravel's exception handler for global errors
- Return user-friendly error messages
- Log detailed errors with context

**GUI-003**: Testing
- Write feature tests for all controller endpoints
- Write unit tests for Services and Actions
- Use Laravel's database transactions in tests
- Mock external API calls

**GUI-004**: Documentation
- All public methods MUST have docblocks
- Complex logic MUST have inline comments
- README files for complex features
- Update API documentation for new endpoints

---

## 7. Database Schema

### Tables

#### [table_name]

```sql
CREATE TABLE [table_name] (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    [column_name] VARCHAR(255) NOT NULL,
    [foreign_key]_id BIGINT UNSIGNED,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY ([foreign_key]_id) 
        REFERENCES [foreign_table](id) 
        ON DELETE CASCADE,
    
    INDEX idx_[column_name] ([column_name])
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Migration Example

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('[table_name]', function (Blueprint $table) {
            $table->id();
            $table->string('[column_name]');
            $table->foreignId('[foreign_key]_id')
                ->constrained()
                ->onDelete('cascade');
            $table->timestamps();
            
            $table->index('[column_name]');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('[table_name]');
    }
};
```

---

## 8. Models & Relationships

### [ModelName] Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class [ModelName] extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        '[column1]',
        '[column2]',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        '[date_column]' => 'datetime',
        '[boolean_column]' => 'boolean',
        '[json_column]' => 'array',
    ];

    /**
     * Get the [related] that owns this [model].
     */
    public function [relation](): BelongsTo
    {
        return $this->belongsTo([RelatedModel]::class);
    }

    /**
     * Get the [related] for this [model].
     */
    public function [relations](): HasMany
    {
        return $this->hasMany([RelatedModel]::class);
    }

    /**
     * Scope query to [condition].
     */
    public function scope[Name]($query)
    {
        return $query->where('[column]', '[value]');
    }

    /**
     * Check if [condition].
     */
    public function is[Condition](): bool
    {
        return $this->[column] === '[value]';
    }
}
```

---

## 9. API Contracts

### Controller Methods

#### Index
```php
/**
 * Display a listing of the resource.
 */
public function index(Request $request): Response
{
    $items = $this->service->getPaginated(
        filters: $request->query('filter'),
        sort: $request->query('sort'),
        perPage: $request->query('per_page', 15)
    );

    return Inertia::render('[Feature]/Index', [
        'items' => $items,
        'filters' => $request->query('filter', []),
    ]);
}
```

#### Store
```php
/**
 * Store a newly created resource.
 */
public function store(Store[Model]Request $request): RedirectResponse
{
    try {
        $model = $this->service->create($request->validated());

        return redirect()
            ->route('[route].show', $model)
            ->with('success', '[Success message]');
    } catch (\Exception $e) {
        Log::error('[Context] failed', [
            'error' => $e->getMessage(),
            'data' => $request->validated(),
        ]);

        return back()
            ->withInput()
            ->withErrors(['error' => '[User-friendly error message]']);
    }
}
```

### Inertia Props Contract

```typescript
// TypeScript interface for component props
interface [Feature]IndexProps {
    items: {
        data: [Model][];
        current_page: number;
        per_page: number;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    filters: {
        [key: string]: string;
    };
}
```

### Service Contract

```php
<?php

namespace App\Services;

use App\Models\[Model];
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class [Feature]Service
{
    /**
     * Get paginated items with filters.
     */
    public function getPaginated(
        ?array $filters = null,
        ?string $sort = null,
        int $perPage = 15
    ): LengthAwarePaginator {
        // Implementation
    }

    /**
     * Create a new item.
     */
    public function create(array $data): [Model]
    {
        // Implementation with DB::transaction
    }

    /**
     * Update an existing item.
     */
    public function update([Model] $model, array $data): [Model]
    {
        // Implementation
    }

    /**
     * Delete an item.
     */
    public function delete([Model] $model): bool
    {
        // Implementation
    }
}
```

---

## 10. Validation Rules

### Form Request

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Store[Model]Request extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Or use gate/policy check
    }

    /**
     * Get the validation rules.
     */
    public function rules(): array
    {
        return [
            'field1' => 'required|string|max:255',
            'field2' => 'required|email|unique:users,email',
            'field3' => ['required', 'integer', new [CustomRule]()],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'field1.required' => 'The field1 is required.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'field1' => 'field name',
        ];
    }
}
```

### Custom Rule

```php
<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class [CustomRule] implements Rule
{
    /**
     * Determine if the validation rule passes.
     */
    public function passes($attribute, $value): bool
    {
        // Validation logic
        return true;
    }

    /**
     * Get the validation error message.
     */
    public function message(): string
    {
        return 'The :attribute is invalid.';
    }
}
```

---

## 11. React Component Examples

### Index Page Component

```jsx
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ items, filters }) {
    const handleFilter = (key, value) => {
        router.get(route('[route].index'), {
            ...filters,
            [key]: value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="[Feature] List" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Filter UI */}
                        
                        {/* Table/Grid */}
                        {items.data.map((item) => (
                            <div key={item.id}>
                                {/* Item display */}
                            </div>
                        ))}

                        {/* Pagination */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
```

### Form Component

```jsx
import { useForm, Head } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        field1: '',
        field2: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('[route].store'));
    };

    return (
        <>
            <Head title="Create [Feature]" />
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="field1" value="Field 1" />
                    <TextInput
                        id="field1"
                        value={data.field1}
                        onChange={(e) => setData('field1', e.target.value)}
                        className="mt-1 block w-full"
                        required
                    />
                    <InputError message={errors.field1} className="mt-2" />
                </div>

                <PrimaryButton disabled={processing}>
                    {processing ? 'Creating...' : 'Create'}
                </PrimaryButton>
            </form>
        </>
    );
}
```

---

## 12. Acceptance Criteria

### Feature Acceptance

**AC-001**: Given a user is authenticated, When they navigate to the [feature] index page, Then they should see a paginated list of items.

**AC-002**: Given a user submits a valid form, When the form is processed, Then the item should be created and the user redirected to the show page with a success message.

**AC-003**: Given a user submits an invalid form, When validation fails, Then the user should see appropriate error messages next to the invalid fields.

**AC-004**: Given a user without permission tries to access a protected route, When they make the request, Then they should receive a 403 Forbidden response.

### Performance Acceptance

**AC-005**: The index page MUST load in under 500ms with 100 records.

**AC-006**: Form submission MUST complete in under 1 second for standard operations.

**AC-007**: Database queries MUST use eager loading to prevent N+1 queries.

---

## 13. Test Automation Strategy

### Test Levels

#### Unit Tests (PHPUnit/Pest)
- Test Service class methods in isolation
- Test Model scopes, accessors, mutators
- Test custom validation rules
- Test Action classes

```php
test('service creates item with valid data', function () {
    $service = new [Feature]Service();
    
    $item = $service->create([
        'field1' => 'value1',
        'field2' => 'value2',
    ]);
    
    expect($item)->toBeInstanceOf([Model]::class)
        ->and($item->field1)->toBe('value1');
});
```

#### Feature Tests (Pest)
- Test complete HTTP request/response cycles
- Test authentication and authorization
- Test form submissions
- Test validation

```php
test('authenticated user can create item', function () {
    $user = User::factory()->create();
    
    $this->actingAs($user)
        ->post(route('[route].store'), [
            'field1' => 'value1',
            'field2' => 'value2',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');
    
    $this->assertDatabaseHas('[table]', [
        'field1' => 'value1',
    ]);
});
```

#### Integration Tests
- Test Service interactions with Models
- Test Events and Listeners
- Test Notifications
- Test Jobs

#### E2E Tests (Laravel Dusk)
- Test critical user flows
- Test form submissions with JavaScript
- Test authentication flows

### Test Coverage Requirements
- Services: 90% coverage minimum
- Controllers: 80% coverage minimum
- Models: 70% coverage minimum
- Overall: 80% coverage minimum

### CI/CD Integration
- Run tests on every pull request
- Run tests before deployment
- Generate coverage reports
- Fail build if coverage drops below threshold

---

## 14. Security Requirements

**SEC-001**: Authentication
- All protected routes MUST use `auth` middleware
- API routes MUST use Sanctum authentication

**SEC-002**: Authorization
- All resource operations MUST check permissions via Policies
- Use `authorize()` method in Form Requests or controllers

```php
public function authorize(): bool
{
    return $this->user()->can('create', [Model]::class);
}
```

**SEC-003**: Input Validation
- ALL user input MUST be validated
- Use parameterized queries or Eloquent to prevent SQL injection
- Sanitize output to prevent XSS

**SEC-004**: Mass Assignment Protection
- Define `$fillable` or `$guarded` on all models
- Never use `unguarded()` in production code

**SEC-005**: CSRF Protection
- All forms MUST include CSRF token
- Inertia forms automatically include CSRF token

---

## 15. Dependencies & External Integrations

### Laravel Packages

**PKG-001**: Laravel Framework
- Version: 12.x
- Purpose: Core framework
- Required: Yes

**PKG-002**: Inertia.js Laravel Adapter
- Package: `inertiajs/inertia-laravel`
- Purpose: Server-side adapter for Inertia.js
- Required: Yes

**PKG-003**: Laravel Sanctum (if API authentication needed)
- Package: `laravel/sanctum`
- Purpose: API token authentication
- Required: Conditional

### Frontend Dependencies

**FE-001**: React
- Version: 18.x
- Purpose: UI library
- Required: Yes

**FE-002**: Inertia.js React Adapter
- Package: `@inertiajs/react`
- Purpose: Client-side Inertia adapter
- Required: Yes

**FE-003**: Tailwind CSS
- Version: 3.x
- Purpose: Utility-first CSS framework
- Required: Yes (per Laravel Breeze default)

### Infrastructure Dependencies

**INF-001**: Database
- Type: MySQL 8.0+ or PostgreSQL 13+
- Purpose: Primary data store
- Configuration: Connection pooling, proper indexes

**INF-002**: Redis (Optional)
- Purpose: Session storage, cache, queue driver
- Configuration: Per environment needs

**INF-003**: Queue Worker (Optional)
- Purpose: Background job processing
- Options: Database, Redis, SQS, etc.

### External Services

**EXT-001**: [Service Name]
- Purpose: [What it does]
- Integration: [How it's integrated]
- Fallback: [What happens if unavailable]

---

## 16. Edge Cases & Examples

### Edge Case 1: [Description]

**Scenario:** [When this happens]

**Expected Behavior:** [What should occur]

**Implementation:**
```php
// Code example handling this edge case
public function handleEdgeCase($data)
{
    if ($this->isEdgeCase($data)) {
        // Handle specially
    }
    
    // Normal flow
}
```

### Edge Case 2: Concurrent Requests

**Scenario:** Two users update the same record simultaneously

**Expected Behavior:** Use optimistic locking or database transactions

**Implementation:**
```php
DB::transaction(function () use ($model, $data) {
    $model->lockForUpdate()->first();
    $model->update($data);
});
```

### Edge Case 3: File Upload Limits

**Scenario:** User uploads file exceeding size limit

**Expected Behavior:** Validate file size and return clear error

**Implementation:**
```php
public function rules(): array
{
    return [
        'file' => 'required|file|max:10240', // 10MB
    ];
}
```

---

## 17. Validation Criteria

### Code Review Checklist

- [ ] Controller methods are under 25 lines
- [ ] No business logic in controllers
- [ ] All validation uses Form Requests or Rules
- [ ] Services handle complex operations
- [ ] Database transactions in services only
- [ ] All relationships defined in models
- [ ] Migrations follow Laravel conventions
- [ ] Inertia components receive typed props
- [ ] No localStorage/sessionStorage usage
- [ ] All routes have appropriate middleware
- [ ] Policies used for authorization
- [ ] Tests cover all critical paths
- [ ] PSR-12 standards followed
- [ ] Type hints on all methods
- [ ] Docblocks on public methods

### Performance Validation

- [ ] No N+1 query issues
- [ ] Appropriate indexes on database columns
- [ ] Pagination implemented for lists
- [ ] Eager loading used where needed
- [ ] Heavy operations queued

### Security Validation

- [ ] All inputs validated
- [ ] Authorization checks in place
- [ ] Mass assignment protected
- [ ] CSRF protection enabled
- [ ] No SQL injection vulnerabilities

---

## 18. Rationale & Context

[Explain the reasoning behind key architectural decisions]

### Why Service Layer?
Controllers should be thin and focused on HTTP concerns. Business logic in services makes code testable, reusable, and maintainable.

### Why Form Requests?
Complex validation logic doesn't belong in controllers. Form Requests provide a dedicated place for validation rules and authorization.

### Why Actions for Single Operations?
When an operation is complex but focused on one thing, Actions provide a reusable, testable class that can be used across contexts (controllers, jobs, commands).

### Why No localStorage in Inertia?
Inertia components are server-rendered on each navigation. localStorage won't persist across Inertia visits. Use Laravel sessions or database storage instead.

---

## 19. Related Specifications

- [Link to related spec 1]
- [Link to related spec 2]
- [Laravel 12 Documentation](https://laravel.com/docs/12.x)
- [Laravel 12 with react starter kit](https://laravel.com/docs/12.x/starter-kits#laravel-breeze)
- [React Best Practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)
- [Inertia.js Documentation](https://inertiajs.com)
- [React Documentation](https://react.dev)

---

## 20. Appendix

### Useful Commands

```bash
# Generate Controller
php artisan make:controller [Name]Controller --resource

# Generate Service (manual)
mkdir -p app/Services
touch app/Services/[Name]Service.php

# Generate Form Request
php artisan make:request Store[Model]Request

# Generate Rule
php artisan make:rule [RuleName]

# Generate Migration
php artisan make:migration create_[table]_table

# Generate Model with migration and factory
php artisan make:model [Name] -mf

# Generate Inertia page (manual)
mkdir -p resources/js/Pages/[Feature]
touch resources/js/Pages/[Feature]/Index.jsx

# Run tests
php artisan test

# Run specific test file
php artisan test tests/Feature/[TestFile].php

# Check code style
./vendor/bin/pint

# Generate IDE helper
php artisan ide-helper:generate
php artisan ide-helper:models
```

### Common Patterns

#### Pattern: Service with Transaction
```php
public function create(array $data): Model
{
    return DB::transaction(function () use ($data) {
        $model = Model::create($data);
        $this->performRelatedOperations($model);
        return $model;
    });
}
```

#### Pattern: Controller with Service Injection
```php
public function __construct(
    private [Feature]Service $service
) {}
```

#### Pattern: Inertia Form with useForm
```jsx
const { data, setData, post, processing, errors } = useForm({
    field: ''
});
```

---

**End of Specification**
```

---

## How to Use This Template

1. **Save this template** as `spec-template-laravel-react.md` in your