# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@talentia/angular-in-viewport` is a small Angular directive + service that reports when an element
enters/leaves the browser viewport, built on a single shared `IntersectionObserver`. It is maintained
by Talentia and consumed by `@talentia/components` (core-components) and by the HCM front-end — check
real usage there before changing behavior.

The workspace has two projects: the library (`projects/angular-in-viewport`) and a demo app
(`projects/demo`). The library version follows the release branch name (e.g. branch `1.0.11` →
version `1.0.11`); the README holds the library ↔ Angular compatibility table.

## Commands

```bash
npm run build          # clean:build + build:prod — production library build (dist/angular-in-viewport)
npm run build:dev      # development build
npm start              # build:dev + ng serve demo (http://localhost:4200)
npm run watch          # lib + demo in watch mode
npm run demo:prod      # production build of the demo (also demo:dev); CI runs build:prod + demo:prod
npm run lint           # ng lint (lib + demo)
npm run lint:lib-fix   # ng lint of the library with --fix
npm run madge:lib      # circular-dependency check
npm run update-browserslist
```

There is no test framework (no Jest/Karma, no `*.spec.ts`): verify behavior in the demo or in a
consumer. Node version: `.nvmrc`.

## Architecture

Everything lives in `projects/angular-in-viewport/src/lib/directives/`:

- **`in-viewport.service.ts`** — `InViewportService` (`providedIn: 'root'`). Owns **one**
  `IntersectionObserver` for the whole app (`threshold: [0.5]`, no root margin) and a `Subject` of
  entries; `observe(element)` returns an Observable filtered on that element and `unobserve()`s it on
  `finalize` (i.e. when the subscriber unsubscribes).
- **`in-viewport.directive.ts`** — `InViewportDirective` (`[ngxInViewPort]`, `standalone: false`).
  Output `inViewport` emits the raw `IntersectionObserverEntry`. `[oneTime]="true"` emits once, the
  first time `intersectionRatio >= 0.5`; otherwise every observer callback is forwarded (the consumer
  decides with `isIntersecting` / `intersectionRatio`). On the server (`isPlatformBrowser` false) and
  with `[preRender]="true"` (default) it emits a fake entry `{ isIntersecting: true, intersectionRatio: 1 }`
  so SSR renders the content. Uses `inject()` and `takeUntilDestroyed`.
- **`in-viewport.module.ts`** — `InViewportModule` declares/exports the directive. It does not import
  `CommonModule` (the directive has no template).

Because of the 0.5 threshold, an element visible for less than half of its height is reported as
"out" — this is by design and identical across Angular versions (verified in HCM-8031).

## Working in this codebase

- Angular upgrades are done **without adopting new Angular features**: the directive stays
  `standalone: false` in its NgModule, the demo keeps zone.js via `provideZoneChangeDetection()`.
- `@angular/*` versions are pinned exactly (no `^`/`~`); the library peer range is `^<major>.0.0`.
  No `overrides` in `package.json`: the transitive `@angular-devkit/*` of angular-eslint are kept on
  the framework patch only by `package-lock.json` (+ `npm ci` in CI).
- The demo highlights the elements currently in viewport and shows a counter badge — a quick visual
  check after any change.
- `tmp/` is git-ignored and may contain task worklogs/scripts (e.g. `tmp/HCM-8031/`).
