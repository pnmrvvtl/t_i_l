# Guide 1: Core Principles (Quick Reference)

## Key Rules

**LLM = constructor, not architect**
- You define WHAT and HOW
- Specificity beats abstraction
- Iterations beat one big request

**Task ready for LLM if:**
- Described in 3-5 sentences
- Clear input and output
- You know how to verify result
- Can draw on napkin in 2 minutes

**NOT suitable for LLM:**
- Architectural decisions
- Critical security (auth, payments)
- Complex algorithms
- Large system integrations

**Perfect for LLM:**
- Boilerplate code
- CRUD operations
- UI components
- Forms and validation
- Utility functions

## Work Cycle

```
PLANNING (30%) → REQUEST (5%) → CHECK (20%) → 
TEST (25%) → ITERATION (20%)
```

More than 3 iterations = task was too big.

---

# Guide 2: Preparation (Checklist)

## Task Size Assessment

**Count elements:**

Frontend:
- Interactive elements (buttons, inputs): 1-5 ✅ | 5-10 ⚠️ | >10 ❌
- useState hooks: 1-3 ✅ | 3-5 ⚠️ | >5 ❌
- JSX elements: up to 10 ✅ | 10-20 ⚠️ | >20 ❌

Backend:
- Endpoints: 1-3 ✅ | 3-5 ⚠️ | >5 ❌
- Database queries in handler: 1-3 ✅ | 3-5 ⚠️ | >5 ❌
- Validation rules: up to 7 ✅ | >7 ❌

**Time test:**
- < 5 min to explain → simple, give to LLM
- 5-15 min → medium, split into 2-3 parts
- > 15 min → complex, split into 5+ parts

## Decomposition: "Layers" method

```
Layer 1: Basic structure (HTML/routing)
Layer 2: Styling and layout
Layer 3: Interactivity and state
Layer 4: API integration
Layer 5: Polish (animations, edge cases)
```

**Give LLM max 2 layers at a time.**

## 5 questions before prompt

1. What does user see? (UI/Output)
2. What does user do? (Actions)
3. Where's data from? (Input)
4. Where does data go? (Destination)
5. What can go wrong? (Errors)

**Answer "don't know" → task not ready.**

## Dependency Matrix

```
Component     | Depends on  | Order
--------------|-------------|------
API client    | -           | 1
Types         | -           | 2
UserCard      | Types       | 3
UserList      | UserCard    | 4
Dashboard     | UserList    | 5
```

**Rule: generate bottom-up.**

## Material Preparation

**Required:**
- Tech stack (React 18 + TS, Node + Express)
- Data examples (3-5 objects)
- UI reference (screenshot or description)

**For screenshots:**
- 1 component = 1 screenshot
- Minimum 1080p
- Annotate important parts

**For UI:**
- Hex color codes (#3B82F6)
- Specific sizes (padding: 16px)
- Responsive breakpoints

## Readiness Checklist

- [ ] Can describe in 3 sentences
- [ ] Know tech stack
- [ ] Have data examples
- [ ] Understand how to verify
- [ ] No dependencies on unfinished parts
- [ ] No more than 9 requirements

---

# Guide 3: Prompt (Template)

## Basic Template

```markdown
CONTEXT:
[Stack: React 18 + TypeScript, Tailwind CSS]

TASK:
[Create [type] that [action] for [goal]]

REQUIREMENTS:
1. [Specific requirement]
2. [Specific requirement]
...

DATA:
[Structure with examples]

DETAILS:
[Colors, sizes, behavior]

DO NOT:
[What NOT to do]

FORMAT:
[How to organize files]
```

## Prompt Component Examples

**Context:**
```
Stack: React 18 + TypeScript + Vite
UI: Tailwind CSS (v3)
Icons: lucide-react
State: useState (no Redux)
```

**Task (1 sentence):**
```
Create user card component with Edit and Delete buttons
```

**Requirements (specific, up to 7 points):**
```
1. Display avatar, name, email, role
2. Edit button: Pencil icon, visible if isEditable=true
3. Delete button: Trash2 icon, shows confirm dialog
4. Click on avatar: calls onUserClick(userId)
5. Admin role: gold badge, user: gray badge
```

**Data (with types):**
```typescript
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
}
```

**Details:**
```
Colors:
- Primary: #3B82F6
- Admin badge: #FBBF24
- User badge: #9CA3AF

Sizes:
- Width: 320px
- Padding: 16px
- Avatar: 64x64px circle
- Border radius: 12px
```

**DO NOT (critical!):**
```
- Don't add React Router
- Don't make API calls
- Don't use localStorage
- Don't add animations
```

**Format:**
```
Single file UserCard.tsx with default export
```

## Quick Patterns

**Modifying existing:**
```markdown
TASK: Add [feature] to [component]

EXISTING CODE:
```[code]```

CHANGES:
1. Add: [what]
2. Change: [what]
3. Keep: [what not to touch]
```

**Bug fix:**
```markdown
PROBLEM: [what doesn't work]

CODE:
```[code with bug]```

EXPECTED: [what should happen]
GETTING: [what happens now]

STEPS:
1. [how to reproduce]
```

## Prompt Checklist

- [ ] Tech stack specified
- [ ] Task in 1 sentence
- [ ] Requirements concrete (not "nice button")
- [ ] Data structure shown
- [ ] Hex color codes specified
- [ ] "DO NOT" section included
- [ ] Prompt readable in 1 minute

---

# Guide 4: After Generation (Workflow)

## 1. Quick Check (30 sec)

**Checklist:**
- [ ] Correct stack?
- [ ] Reasonable code size?
- [ ] No syntax errors?
- [ ] Looks like what you asked?

**Red flags (don't run):**
- Code 2-3x bigger than expected
- Uses libraries you don't have
- Lots of commented code

**Action:** Ask LLM to rewrite with constraints.

## 2. Testing (5-10 min)

**Test order:**
1. Happy path (main scenario)
2. Edge cases (empty data, long strings)
3. Error handling (intentionally trigger errors)

**Keep problem log:**
```
❌ Delete doesn't show confirm
❌ Avatar not displayed if no URL
✅ Email validation works
```

## 3. Code Analysis (5 min)

**Do you understand the code?**
- Can you explain what each function does?
- Are variable names clear?

**If you DON'T understand >20% of code:**
```
Explain this function:
```[code]```
What does it do and why written this way?
```

**Quality checklist:**
- [ ] No duplication
- [ ] Functions do one thing
- [ ] Error handling present
- [ ] No console.log

## 4. Iterations (1 change = 1 prompt)

**Priorities:**
1. Critical: main function doesn't work
2. Important: no error handling, validation
3. Nice to have: animations, style details

**Rule:**
- ✅ 1-2 iterations: normal
- ⚠️ 3 iterations: task was borderline
- ❌ >3 iterations: STOP, reformulate task

**"Isolation" technique:**
```markdown
CHANGE ONLY:
handleDelete function in lines 45-52

KEEP:
All other code unchanged

CHANGE:
Add window.confirm before delete
```

## 5. When to Stop

**Task complete if:**
- [ ] Main functionality works
- [ ] All requirements implemented
- [ ] No critical bugs
- [ ] You understand the code
- [ ] Code is maintainable

**Perfectionism signs (STOP):**
- Works but want to "improve" without goal
- Rewriting 3+ times same code
- Optimizing without performance issues

**80/20 rule:** 80% result for 20% effort = excellent.

## 6. Save Results

**Commit:**
```
feat: add UserCard component

- Display user info with edit/delete
- Responsive Tailwind design
- AI-generated: Claude, manually fixed delete confirm

AI-assisted: initial code by Claude
```

**Documentation:**
```typescript
/**
 * Generated: Claude LLM (2025-10-26)
 * Modified: Added confirm dialog
 * TODO: Add skeleton loading
 */
```

## 7. Learn from Mistakes

**Problem log:**
```markdown
## 2025-10-26: UserCard

PROBLEMS:
1. No confirm dialog
   → SOLUTION: Explicitly write "show confirm"

2. Colors didn't match
   → SOLUTION: Specify hex codes

TIME: 25 min (expected 15)
ITERATIONS: 3

TAKEAWAYS:
- Describe interactivity in detail
- Specify code size limit
```

**Update template:**
```markdown
v2.1: + Added "Interactivity" section
      + Always hex codes
      + Limit "max X lines"
```

## Final Workflow

```
1. CHECK (30 sec)
   ↓
2. TEST (5-10 min)
   ↓
3. ANALYZE (5 min)
   ↓
   OK? → YES → Commit
   ↓ NO
4. ITERATION (1 change)
   ↓
   >3 iterations? → STOP → Reformulate
```

## Common Mistakes

**❌ Bad:**
- "Make nice form"
- Many requirements in 1 prompt
- Refactoring large chunks via LLM
- More than 3 iterations without rethinking

**✅ Good:**
- "Form with email, password, submit button"
- 1 prompt = 1 change
- Small iterations with isolation
- After 3 iterations → new prompt

---

# Cheat Sheet: Quick Start

## Before Request

```
1. Count elements (up to 5 interactive = OK)
2. 5 questions: see? do? from? to? errors?
3. Can describe in 3 sentences? YES → go
```

## Prompt

```
CONTEXT: [stack]
TASK: [1 sentence]
REQUIREMENTS: [up to 7 points]
DATA: [structure with example]
DETAILS: [colors hex, sizes px]
DO NOT: [critical!]
```

## After Generation

```
1. Check 30 sec → flags? → re-ask
2. Test 10 min → problem log
3. Analyze 5 min → understand code?
4. Iterations → 1 prompt = 1 change
5. >3 iterations → STOP → reformulate
6. Works → commit → log takeaways
```

## Golden Rules

1. Specificity > abstraction
2. Iterations > one big request
3. 1 prompt = 1 change
4. >3 iterations = task too big
5. Don't understand code = problem
6. 80/20 = good enough
