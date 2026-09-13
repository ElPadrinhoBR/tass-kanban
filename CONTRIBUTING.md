# Contributing to TASS Kanban

Thank you for your interest in contributing to TASS Kanban! This document outlines the guidelines and process to make contributions smooth and consistent.

---

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

---

## How to Contribute

### 1. Reporting Bugs

Open an issue using the [Bug Report template](https://github.com/ElPadrinhoBR/tass-kanban/issues/new?template=bug_report.yml).

Include:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots if applicable
- Browser and OS version

### 2. Suggesting Features

Open an issue using the [Feature Request template](https://github.com/ElPadrinhoBR/tass-kanban/issues/new?template=feature_request.yml).

Include:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives considered

### 3. Submitting Code Changes

1. **Fork** the repository
2. **Clone** your fork locally
3. Create a **feature branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
4. Make your changes following the guidelines below
5. **Run the build** to ensure no TypeScript errors:
   ```bash
   npm run build
   ```
6. **Commit** following [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add multilingual support for agents"
   git commit -m "fix: correct WIP limit calculation for review column"
   git commit -m "docs: update architecture diagram"
   ```
7. **Push** and open a **Pull Request** to `main`

---

## Development Setup

```bash
git clone https://github.com/ElPadrinhoBR/tass-kanban.git
cd tass-kanban
npm install
npm run dev
```

---

## Code Guidelines

### TypeScript
- Strict mode enabled — no `any` types without justification
- All public functions must have JSDoc comments
- Interfaces must be defined in `src/types/`

### Naming Conventions
| Element | Convention | Example |
|:---|:---|:---|
| Components | PascalCase | `KanbanCardItem.tsx` |
| Hooks / stores | camelCase | `useLanguageStore.ts` |
| Types / interfaces | PascalCase | `ChatMessage`, `KanbanCard` |
| Constants | UPPER_SNAKE_CASE | `INITIAL_CHANNELS` |
| CSS classes | Tailwind utility | `text-slate-400 hover:text-white` |

### Commits — Conventional Commits Prefix

| Prefix | When to use |
|:---|:---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, no logic change |
| `refactor:` | Code change, no new feature or bug fix |
| `perf:` | Performance improvement |
| `test:` | Adding tests |
| `chore:` | Tooling, config, dependencies |
| `i18n:` | Translation / internationalization |

### Branch Naming
```
feat/description-here
fix/issue-description
docs/update-readme
i18n/add-french-locale
```

---

## Adding a New Language

1. Create `src/i18n/locales/XX.ts` (where `XX` is the ISO 639-1 code)
2. Copy the structure from `src/i18n/locales/en.ts` and translate all values
3. Register in `src/i18n/index.ts`:
   - Import and add to `LOCALES`
   - Add to `LANGUAGE_OPTIONS` with flag and label
4. Open a PR labeled `i18n`

---

## Adding a New Visual Theme

1. Add a new entry to `THEMES` in `src/data/themePresets.ts`
2. Define all required `ThemeConfig` keys (kanban + chat palette)
3. Test with all 4 chat channels and all card categories
4. Open a PR labeled `enhancement`

---

## Questions?

Open a [GitHub Discussion](https://github.com/ElPadrinhoBR/tass-kanban/discussions) — we're happy to help!
