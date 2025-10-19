# Frontend Project Help Instruction Template

Use this template to provide context when asking for help with an existing frontend project.

---

## 1. Tech Stack
- Share `package.json` (dependencies + devDependencies).
- Specify framework/library (React, Next.js, Vue, Angular, etc.).
- Specify TypeScript or JavaScript.

## 2. Styling Setup
- Which styling solution is used (CSS, SCSS, CSS Modules, Tailwind, styled-components, Emotion, etc.)?
- Share location of global styles, reset/normalize files.
- Provide global variables/themes file if available (CSS vars, SCSS vars, Tailwind config, etc.).

## 3. Project Constraints
- Am I allowed to install new packages, or should I only use existing ones?
- Is tree-shaking / bundle size critical (i.e., avoid heavy dependencies)?

## 4. Design System & UI Approach
- Which design system is followed (Material UI, Ant Design, custom components, etc.)?
- Are there reusable UI components already? Where are they located?
- Should I follow a specific pattern (Atomic Design, Feature-Sliced, etc.)?

## 5. Folder & Architecture Overview
- How is the project structured (e.g., `src/components`, `src/pages`, `src/hooks`, etc.)?
- Are there naming conventions or architectural rules?

## 6. Routing & State Management
- Which router is used (React Router, Next.js, custom)?
- Which state management (Redux, Zustand, Context API, Recoil, MobX)?

## 7. Backend & API Setup
- How does the frontend talk to the backend (REST, GraphQL, tRPC, etc.)?
- Is there an API client abstraction layer?

## 8. Testing
- What testing framework is used (Jest, Vitest, Cypress, Playwright, RTL)?
- Is testing mandatory for new code?

## 9. Build & Deployment
- Which build tool is used (Webpack, Vite, Turbopack, etc.)?
- Any CI/CD constraints (linting rules, pre-commit hooks, required test coverage)?

## 10. Special Project Rules
- Any coding guidelines (ESLint, Prettier config)?
- Any performance/security constraints I should keep in mind?
- Anything explicitly forbidden (like inline styles, direct DOM manipulation, etc.)?
