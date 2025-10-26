# Guide 1: General Principles for Working with LLM

## Philosophy of Interaction

**Principle 1: LLM is a constructor, not an architect**
- LLM excels at building from blueprints, but poorly creates architecture
- You define WHAT and HOW, LLM writes the code
- The more precise the blueprint, the better the result

**Principle 2: Iteration beats completeness**
- Better 10 small steps than 1 big leap
- Each step = understanding + control
- You can change direction after each step

**Principle 3: Specificity beats abstraction**
- "nice button" = 100 variants
- "blue button #3B82F6, rounded-lg, padding 12px 24px" = 1 variant
- Fewer variants = faster result

**Principle 4: Context is everything**
- Technology stack
- Existing code (if extending)
- Constraints and NOT-requirements
- Response format

## Mental Model: Dialogue with a Junior

Imagine LLM is a very fast but inexperienced developer:

**They can:**
- Quickly write typical code
- Follow clear instructions
- Find patterns in examples
- Adapt existing code

**They CANNOT:**
- Understand business context without explanation
- Predict your preferences
- See the big picture of a large project
- Make architectural decisions

**Therefore:**
- Give concrete tasks
- Explain context
- Show examples
- Verify results
- Guide if going off track

## When to Use What

### LLM is ideal for:

**Generation from scratch:**
- New components by specification
- CRUD endpoints
- Utility functions
- Typical forms
- Basic API clients

**Transformation:**
- Refactoring small functions
- Changing component styles
- Adding new form fields
- Updating API response format

**Explanation:**
- How someone else's code works
- Why an error occurs
- Solution variants for a problem

### LLM is NOT ideal for:

**Architecture:**
- Choosing between approaches
- Entire project structure
- Patterns for scaling

**Critical code:**
- Security (auth, payments)
- Complex algorithms
- Performance-critical sections

**Integration:**
- Understanding how system parts interact
- Debugging inter-service communication
- Full e2e flow

## Signs of a Correct Task for LLM

**✅ Task ready for LLM if:**
- You can describe result in 3-5 sentences
- Clear input (data/parameters) and output (UI/response)
- Single clear success criterion
- You know how to verify it works correctly
- Can draw block diagram on napkin in 2 minutes

**❌ Task NOT ready if:**
- "Make something like X, but different"
- You don't understand all requirements yourself
- Depends on many other system parts
- Need to "see what works better"
- You don't know what result should be

## Work Cycle

```
1. PLANNING (30% of time)
   ↓
2. REQUEST TO LLM (5% of time)
   ↓
3. CODE REVIEW (20% of time)
   ↓
4. TESTING (25% of time)
   ↓
5. ITERATION or NEXT TASK (20% of time)
```

If planning takes less time - you haven't thought enough.
If more than 3 requests for one task - task was too big.

---

# Guide 2: Preprocessing - Preparation Before Request

## Step 1: Decomposition - understanding scale

### "Onion Layers" Method

Break task into layers from simplest to complex:

**Example: "Registration form with email verification"**

```
Layer 1 (Core): HTML form with email, password fields
Layer 2 (Basic UX): Styles, layout, responsive
Layer 3 (Validation): Format validation, error messages
Layer 4 (Integration): Send to API, loading states
Layer 5 (Polish): Animations, successful registration, edge cases
```

**Rule**: Give LLM maximum 2 layers at once.

### "Understanding Questions" Method

Before any task answer yourself:

1. **What does user see?** (UI/Output)
2. **What does user do?** (Interactions)
3. **Where's data from?** (Input/Source)
4. **Where does data go?** (Output/Destination)
5. **What can go wrong?** (Error cases)

If answer to any question is "don't know" - task not ready.

### "Timeboxing" Method

**Estimate: how long to explain this to another developer?**

- < 5 minutes → Simple task, can give to LLM
- 5-15 minutes → Medium, split into 2-3 parts
- 15-30 minutes → Complex, split into 5+ parts
- > 30 minutes → This isn't a task, it's a project. Decompose deeper.

## Step 2: Assessment - defining boundaries

### Frontend: "three components" rule

Open any UI framework (Material-UI, Ant Design). Look at their components:

**Simple (1 LLM request):**
- Button, Input, Card, Badge, Alert
- Usually 50-150 lines of code
- 1-3 props
- No complex logic

**Medium (2-3 LLM requests):**
- Form, Modal, Table (without pagination), Dropdown
- 150-400 lines of code
- 5-10 props
- State management

**Complex (5+ LLM requests):**
- DataGrid, Chart, Rich Text Editor, File Upload with preview
- 400+ lines of code
- Multiple features
- Must split

**Your task more complex than the most complex component in UI library? Definitely need to split.**

### Backend: "REST endpoint" rule

**1 endpoint = 1 task for LLM** (usually)

**Simple endpoint (1 request):**
```
GET /users/:id
- Get by ID
- Return 404 if not found
- Return JSON
```

**Medium endpoint (2 requests):**
```
POST /users
- Accept data
- Validate
- Save to DB
- Return created object or errors
```

**Complex endpoint (split into parts):**
```
POST /orders/checkout
- Check cart
- Calculate price
- Apply promo code
- Deduct from inventory
- Create order
- Send email
- Return order details
```
→ Split into: cart validation, price calculation, order creation, notifications

### Quantitative Metrics

**Frontend - count elements:**
- Interactive elements (buttons, inputs): 1-5 at a time
- Top-level JSX elements: up to 10
- useState calls: up to 3
- useEffect hooks: up to 2
- Props in component: up to 7

**Backend - count operations:**
- Database queries: up to 3 in one handler
- Validation rules: up to 5-7
- If-else branches: up to 5
- Functions in one file: up to 4

**Exceeding these numbers? → Split the task.**

## Step 3: Fragmentation - task division

### "Vertical Slices" Strategy

**❌ Bad (horizontal slicing):**
```
1. Make all components
2. Make all logic
3. Connect to API
```

**✅ Good (vertical slicing):**
```
1. Component A + its logic + its API
2. Component B + its logic + its API
3. Integration of A and B
```

Each slice = working end-to-end feature.

### Dependency Matrix

Draw simple table:

```
Component/Function | Depends on | Used in
-------------------|------------|----------------
UserCard           | User type  | UserList, Dashboard
UserList           | UserCard   | Dashboard
Dashboard          | API client | App
API client         | -          | Everywhere
```

**Development order = bottom-up:**
1. API client (depends on nothing)
2. User type (doesn't depend)
3. UserCard (depends on User type)
4. UserList (depends on UserCard)
5. Dashboard (depends on all)

**Rule**: First generate what others depend on.

### Fragmentation Checklist

For each task part:

- [ ] Can work independently from others?
- [ ] Can be tested in isolation?
- [ ] Clear input and output?
- [ ] One file or maximum 2?
- [ ] Fits your understanding (can you retell)?

If even one "no" - split further.

## Step 4: Material Preparation

### Technical Context (mandatory)

Create template for your project and use every time:

```
Stack: React 18 + TypeScript + Vite
Styling: Tailwind CSS
State: Zustand
API: Axios
Form: React Hook Form + Zod
```

### Reference Collection

**For UI tasks:**

1. **Find similar component:**
   - In UI library (shadcn/ui, MUI)
   - On websites (dribbble, mobbin for mobile)
   - In your project (what already works)

2. **Screenshot or describe:**
   - "Like MUI Button, but different colors"
   - "Like Gmail inbox, but without labels"

3. **Define differences:**
   - What to add
   - What to remove
   - What to change

**For logic/API:**

1. **Find similar endpoint:**
   - In API documentation
   - In another project service
   - In OpenAPI/Swagger examples

2. **Copy structure:**
   - Request body example
   - Response example
   - Error responses

### Screenshot Preparation (if using)

**Quality screenshot checklist:**

- [ ] Minimum 1080p resolution
- [ ] Only target component (crop rest)
- [ ] Clear borders (not blurry)
- [ ] All text readable
- [ ] All elements fully visible
- [ ] One component = one screenshot

**If component is complex:**

Make several screenshots:
- General view
- Each state (hover, active, disabled)
- Each variant (if sizes/themes exist)

**Screenshot annotation:**

Use any tool (even Paint):
- Red frames - what's important
- Arrows - element connections
- Text - part names
- Sizes - if critical

### Working Data

**Prepare data examples:**

```typescript
const exampleUser = {
  id: "123",
  name: "John Doe",
  email: "john@example.com",
  role: "admin"
}
```

**For lists - give 3-5 objects:**
- Typical case
- Edge case (long name, no photo, etc.)
- Minimal (only required fields)

**For API:**
- Successful response
- Validation error
- 404 error
- 500 error

## Step 5: Success Criteria Formulation

### Define "Definition of Done"

Write list of what should work:

**Example for form:**
```
✓ All fields render
✓ Validation shows on blur
✓ Submit button disabled if form invalid
✓ On submit calls onSubmit with correct data
✓ Loading state during submission
✓ API errors shown to user
```

### Prepare Test Cases

Even mentally:

1. **Happy path**: What should work ideally
2. **Edge cases**: Empty data, long strings, special characters
3. **Error handling**: What if API doesn't respond, validation fails

**If you can't write test cases - task not ready.**

## Final Checklist Before Request

Go through this list before each prompt:

- [ ] I can describe task in 3 sentences
- [ ] I know what code I'll get (roughly files and lines)
- [ ] I prepared technical context
- [ ] I know where data comes from and goes
- [ ] I can verify result in 5 minutes
- [ ] I have reference or clear UI description
- [ ] I know what to do if this doesn't work (plan B)
- [ ] This part doesn't depend on unfinished parts

**If even one point is "no" - return to planning.**

---

# Guide 3: Prompt Composition - Effective Communication

## Perfect Prompt Structure

### Prompt Template (copy and adapt)

```markdown
CONTEXT:
[Technical stack and environment]

TASK:
[One sentence - what to create]

REQUIREMENTS:
[Numbered list of specific requirements]

DATA:
[Structure of incoming/outgoing data]

DETAILS:
[Specific details: colors, sizes, behavior]

DO NOT:
[What definitely not needed]

FORMAT:
[How to organize code]
```

## Component 1: Context

### What to ALWAYS Include

**Minimal technical context:**

Frontend:
```
React 18 + TypeScript
Tailwind CSS
```

Backend:
```
Node.js + Express + TypeScript
PostgreSQL + Prisma
```

### Extended Context (when needed)

**Add if using:**

State management:
```
State: Zustand (global), useState (local)
```

Specific libraries:
```
Forms: React Hook Form + Zod validation
```

Architectural patterns:
```
Architecture: Feature-based folder structure
```

Existing code:
```
Based on: Card component from /components/ui/card.tsx
```

### Context Examples

**Bad:**
```
I use React
```

**Good:**
```
Stack: React 18 + TypeScript + Vite
UI: Tailwind CSS (v3)
Icons: lucide-react
```

**Excellent:**
```
Stack: React 18 + TypeScript + Vite
UI: Tailwind CSS (v3) + following existing design with primary: #3B82F6
Icons: lucide-react
State: props + local useState (no Redux)
Naming: camelCase for variables, PascalCase for components
```

## Component 2: Task

### One Sentence Formula

```
Create [TYPE] that [ACTION] for [GOAL]
```

**Examples:**

Frontend:
```
Create React component that displays user card with edit capability
```

Backend:
```
Create POST endpoint that registers new user and returns JWT token
```

### Avoid Vagueness

**❌ Bad:**
- "Make a form"
- "Need API for users"
- "Component for displaying data"

**✅ Good:**
- "Login form with email and password"
- "GET endpoint for getting user list with filtering"
- "Table with 5 columns and click sorting"

## Component 3: Requirements

### MECE Principle (Mutually Exclusive, Collectively Exhaustive)

Each requirement should be:
- **Specific** (measurable)
- **Independent** (doesn't overlap with others)
- **Complete** (together cover everything)

### Requirements Structure

**Requirement categories:**

1. **Functional** (what it does)
2. **UI/UX** (how it looks and behaves)
3. **Data** (what it accepts/returns)
4. **Validation** (what rules)
5. **Error handling** (what to do with problems)

### Requirements Examples

**Frontend - Form:**

```markdown
REQUIREMENTS:
1. Fields: email (text input), password (password input), remember me (checkbox)
2. Email validation: format check, show error under field
3. Password validation: minimum 8 characters, show error under field
4. Submit button: disabled if form invalid, shows "Loading..." during submission
5. On success: call onSuccess callback with data {email, password, rememberMe}
6. On error: show red Alert above form with error text
```

**Backend - API Endpoint:**

```markdown
REQUIREMENTS:
1. Route: POST /api/auth/register
2. Request body: {email: string, password: string, name: string}
3. Validation: email format, password minimum 8 characters, name required
4. Check: email must be unique in DB
5. On success: create user, return 201 {userId, token, name}
6. On duplicate email: return 409 {error: "Email already exists"}
7. On invalid data: return 400 {errors: {field: "message"}}
```

### "7±2" Rule

Humans hold 5-9 points in head.

**If more than 9 requirements - task too big.**

Split into subtasks:
```
Task A: Requirements 1-5
Task B: Requirements 6-9
```

## Component 4: Data

### Types and Formats

**Always show data structure:**

TypeScript:
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
}
```

JavaScript:
```javascript
const exampleUser = {
  id: "abc123",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://...",
  role: "user"
}
```

### Props for Components

**Specify all props:**

```markdown
PROPS:
- user: User (required) - user data for display
- onEdit: (userId: string) => void (optional) - callback on Edit click
- isEditable: boolean (optional, default: false) - show Edit button
```

### API request/response

**Show examples:**

```markdown
REQUEST:
POST /api/users
{
  "name": "John Doe",
  "email": "john@example.com"
}

RESPONSE (success):
201 Created
{
  "id": "user_abc123",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-10-26T10:00:00Z"
}

RESPONSE (error):
400 Bad Request
{
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format"
  }
}
```

## Component 5: Details

### UI/UX Specifics

**Colors (must specify):**
```
Primary: #3B82F6 (blue)
Success: #10B981 (green)
Error: #EF4444 (red)
Background: #F9FAFB (light gray)
```

**Sizes and spacing:**
```
Padding: 16px (inside card)
Gap between elements: 12px
Border radius: 8px
Font size: 14px (normal text), 18px (headings)
```

**Responsive:**
```
Mobile (< 768px): 1 column
Tablet (768px - 1024px): 2 columns
Desktop (> 1024px): 3 columns
```

### Behavior

**Interactivity:**
```
Hover: button changes color to #2563EB (darker blue)
Click: ripple effect
Focus: blue outline 2px
Disabled: opacity 0.5, cursor not-allowed
```

**Animations (if needed):**
```
Appear: fade-in 200ms
Close: fade-out 150ms
Loading: spinner rotation
```

### States

**List all states:**
```
STATES:
- Initial: form empty, submit disabled
- Filling: user entering data, validation on blur
- Submitting: loading spinner, all fields disabled
- Success: show green checkmark, form clears after 2 sec
- Error: red alert, fields remain filled
```

## Component 6: What NOT to Do

### Critically Important!

LLM often adds "extras" if not told explicitly what not needed.

**Typical "DO NOT":**

Frontend:
```
DO NOT:
- Don't add react-router navigation (will be in parent)
- Don't make API call inside component (passed via props)
- Don't add animations (will do later)
- Don't use Context API (will use useState)
```

Backend:
```
DO NOT:
- Don't add JWT middleware (already in router)
- Don't create DB schema (already in schema.prisma)
- Don't add logging (global logger exists)
- Don't hash password (exists in auth service)
```

### Library Limitations

```
DO NOT USE:
- React Query (not in project)
- Lodash (use native JS)
- Moment.js (use date-fns)
```

## Component 7: Response Format

### Code Structure

**Specify how to organize:**

One file:
```
FORMAT:
Single file: UserCard.tsx with default export
```

Multiple files:
```
FORMAT:
/components/UserCard/
  ├── UserCard.tsx (main component)
  ├── UserCardHeader.tsx (subcomponent)
  ├── types.ts (types)
  └── index.ts (re-export)
```

API structure:
```
FORMAT:
/api/users/
  ├── controller.ts (request handlers)
  ├── service.ts (business logic)
  ├── validation.ts (validation schemas)
  └── types.ts (types)
```

### Naming Conventions

```
NAMING:
- Component files: PascalCase (UserCard.tsx)
- Utility files: camelCase (formatDate.ts)
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Interfaces: I prefix (IUserCardProps)
```

## Complete Prompt Examples

### Example 1: Frontend Component

```markdown
CONTEXT:
React 18 + TypeScript
Tailwind CSS (v3)
lucide-react for icons

TASK:
Create user card component with Edit and Delete buttons

REQUIREMENTS:
1. Display avatar (or placeholder if none), name, email, role
2. Edit button (Pencil icon): visible only if isEditable=true
3. Delete button (Trash2 icon): shows confirm before deleting
4. Click on avatar or name: calls onUserClick with userId
5. Admin role shown with gold badge, user with gray
6. Hover: light shadow and card lift

DATA:
interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'user';
  };
  isEditable?: boolean;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  onUserClick?: (userId: string) => void;
}

DETAILS:
Colors:
- Background: white
- Border: #E5E7EB (gray)
- Admin badge: #FBBF24 (gold)
- User badge: #9CA3AF (gray)

Sizes:
- Card width: 320px
- Padding: 16px
- Border radius: 12px
- Avatar: 64x64px circle
- Gap between elements: 12px

DO NOT:
- Don't add React Router Link
- Don't make API calls
- Don't add animations

FORMAT:
Single file UserCard.tsx with default export
```

### Example 2: Backend Endpoint

```markdown
CONTEXT:
Node.js + Express + TypeScript
PostgreSQL + Prisma ORM
Zod for validation

TASK:
Create POST endpoint for creating new user

REQUIREMENTS:
1. Route: POST /api/users
2. Body validation: name (min 2 chars), email (format), password (min 8 chars)
3. Check: email must be unique
4. Hash password with bcrypt (10 rounds)
5. Create DB record with fields: id (auto), name, email, hashedPassword, createdAt (auto)
6. Response 201: userId, name, email (WITHOUT password)
7. Response 400: validation failed with error details
8. Response 409: email already exists

DATA:
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}

Response (201):
{
  "id": "user_abc123",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-10-26T10:00:00Z"
}

Response (400):
{
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}

Response (409):
{
  "error": "Email already exists"
}

DETAILS:
Prisma schema:
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}

DO NOT:
- Don't add JWT token (will be in separate endpoint)
- Don't add email verification (not needed yet)
- Don't add auth middleware (this is public endpoint)

FORMAT:
/api/users/
  ├── create.controller.ts (Express handler)
  ├── create.service.ts (business logic)
  └── validation.ts (Zod schemas)
```

### Example 3: Utility Function

```markdown
CONTEXT:
TypeScript
date-fns library available

TASK:
Create function for formatting dates in human-readable format

REQUIREMENTS:
1. Accepts Date or ISO string
2. If today: "Today at 14:30"
3. If yesterday: "Yesterday at 14:30"
4. If within week: "Monday at 14:30"
5. If older than week: "Oct 15, 2025"
6. If different year: "Oct 15, 2024"
7. Invalid date handling: return "Invalid date"

DATA:
function formatRelativeDate(date: Date | string): string

Examples:
formatRelativeDate(new Date()) → "Today at 14:30"
formatRelativeDate("2025-10-25T10:00:00Z") → "Yesterday at 10:00"
formatRelativeDate("2025-10-20T10:00:00Z") → "Sunday at 10:00"
formatRelativeDate("2025-09-15T10:00:00Z") → "Sep 15, 2025"
formatRelativeDate("invalid") → "Invalid date"

DETAILS:
Timezone: use user's local timezone
Time: 24h format

DO NOT:
- Don't use moment.js
- Don't add i18n (English only)

FORMAT:
Single file formatRelativeDate.ts with named export
```

## Patterns for Typical Tasks

### Pattern: Modifying Existing Code

```markdown
CONTEXT:
[technical stack]

TASK:
Add [new feature] to existing [component/endpoint]

EXISTING CODE:
```[language]
[insert current code]
```

CHANGES:
1. [What to add]
2. [What to change]
3. [What to remove]

PRESERVE:
- [What not to touch]
- [Existing behavior]
```

### Pattern: Refactoring

```markdown
CONTEXT:
[technical stack]

TASK:
Refactor [function/component] for [goal: readability/performance/reusability]

CURRENT CODE:
```[language]
[code to refactor]
```

REFACTORING GOAL:
- [Specific goal 1]
- [Specific goal 2]

CONSTRAINTS:
- Preserve same API (inputs/outputs)
- Don't change functionality
- [Other constraints]
```

### Pattern: Bug Fix

```markdown
CONTEXT:
[technical stack]

PROBLEM:
[Description of what doesn't work]

CODE WITH BUG:
```[language]
[code with bug]
```

EXPECTED BEHAVIOR:
[What should happen]

CURRENT BEHAVIOR:
[What happens now]

STEPS TO REPRODUCE:
1. [Step 1]
2. [Step 2]
3. [Result]

ADDITIONAL:
- Console errors: [if any]
- Suspected cause: [if any]
```

## Advanced Prompting Techniques

### "Show Example" Technique

If you want specific code style - show example:

```markdown
CODE STYLE:
Use this pattern for error handling:

const result = await someFunction();
if (!result.success) {
  return { error: result.error };
}

DON'T use try-catch, only result objects.
```

### "Constraints First" Technique

Constraints first, then requirements:

```markdown
CONSTRAINTS:
- Maximum 150 lines of code
- No external libraries except React
- Works in IE11

REQUIREMENTS:
[rest]
```

### "Negative Examples" Technique

Show what NOT to do:

```markdown
DON'T DO THIS:
```typescript
const data = await fetch(...).then(r => r.json());
setData(data);
```

DO THIS:
```typescript
const response = await fetch(...);
if (!response.ok) throw new Error();
const data = await response.json();
setData(data);
```
```

## Final Prompt Checklist

Before sending check:

- [ ] Tech stack specified
- [ ] Task in 1 sentence
- [ ] Requirements concrete and measurable
- [ ] Data structure shown
- [ ] UI details specified (if frontend)
- [ ] "DO NOT" section exists
- [ ] Response format clear
- [ ] Prompt readable in 1 minute
- [ ] No contradictions in requirements
- [ ] Can verify result

---

# Guide 4: Post-generation - Working with Results

## Step 1: Initial Check (30 seconds)

### Quick Scan

**30-second checklist:**

- [ ] Correct file structure?
- [ ] Using right stack?
- [ ] Code size reasonable? (not 1000 lines instead of 100)
- [ ] No obvious syntax errors?
- [ ] Code visually similar to what you asked?

**Red flags (don't run, re-ask LLM):**

- Code 2-3x larger than expected
- Uses libraries not in project
- Completely different structure than asked
- Lots of commented code
- Uses outdated syntax

### What to Do with Red Flag

**DON'T try to fix yourself** (if code is large).

Send new prompt:

```markdown
Code is too large and uses libraries we don't have.

REQUIRED:
- Use only React built-in hooks (useState, useEffect)
- Maximum 150 lines of code
- No external libraries except lucide-react

Rewrite component with these constraints.
```

## Step 2: Running and Testing (5-10 minutes)

### Step-by-Step Testing

**1. Copying and Installation**

```bash
npm install
```

If missing dependency errors appear - resolve immediately:
- Install or
- Ask LLM to rewrite without them

**2. Happy Path Testing**

Test main scenario:

Frontend:
- Component renders?
- Main action works?
- Data displays?

Backend:
- Endpoint responds?
- Returns correct status?
- Response format correct?

**3. Edge Cases**

Test boundary cases:

- Empty data
- Very long strings
- Special characters
- Missing fields

**4. Error Handling**

Intentionally trigger errors:

- Invalid data
- Non-existent ID
- Unavailable API
- Slow connection

### Problem Log

Keep simple list of what doesn't work:

```
❌ Delete button doesn't show confirm
❌ Avatar not displayed if no URL
✅ Email validation works
❌ Loading state doesn't show
✅ Error message displays
```

## Step 3: Code Analysis (5-10 minutes)

### Readability

**Do you understand the code?**

Read code from start to finish:

- Variable names clear?
- Structure logical?
- Can you explain what each function does?

**If you DON'T understand > 20% of code - it's a problem.**

Actions:
1. Ask LLM to explain unclear parts:
```
Explain this function:
```function code```

What does it do and why written this way?
```

2. Ask to simplify:
```
This logic is too complex. Rewrite simpler and clearer.
Can use more variables for clarity.
```

### Code Quality

**Quality checklist:**

- [ ] No code duplication
- [ ] Functions do one thing
- [ ] No magic numbers/strings
- [ ] Error handling present
- [ ] No console.log in production code
- [ ] No commented code
- [ ] No TODO comments

**If found problems:**

```markdown
CODE PROBLEMS:
1. [Problem 1 description]
2. [Problem 2 description]

Fix these problems, leave rest as is.
```

### Requirements Compliance

**Compare with original prompt:**

Requirement | Implemented | Problem
-----------|-------------|----------
Email validation | ✅ | -
Password >= 8 chars | ✅ | -
Confirm dialog on Delete | ❌ | No confirm
Loading state | ❌ | Doesn't show

**For unimplemented requirements:**

```markdown
Code works, but missing:
1. Confirm dialog on Delete button click
2. Loading spinner during API call

Add these features to existing code.

CURRENT CODE:
```code```
```

## Step 4: Iterative Improvement

### Incremental Changes Strategy

**Rule: 1 prompt = 1 change**

❌ Bad:
```
Fix Delete bug, add animation, improve styles, and optimize performance
```

✅ Good:
```
Prompt 1: Fix Delete confirm dialog bug
Prompt 2: Add fade-in animation on appear
Prompt 3: Change button color to #3B82F6
```

### Change Prioritization

**1. Critical (do immediately):**
- Main function doesn't work
- Console errors
- Wrong data

**2. Important (do next):**
- Missing error handling
- Missing validation
- UX problems (unclear UI)

**3. Nice to have (do at end):**
