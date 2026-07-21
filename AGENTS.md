# Repository Guidelines

## Project Structure & Module Organization
This repository is a Hexo 8 static site for the WenYin Open Source Wiki.
Primary content lives in `source/_posts/` as Markdown posts with YAML front
matter. Shared data is in `source/_data/`, custom styles are in
`source/css/custom.styl`, and images/icons are in `source/images/`.
Site-wide settings are in `_config.yml`; theme-specific Stellar settings are in
`_config.stellar.yml`. `public/` is generated output, so do not edit it
directly. `scaffolds/` contains templates used when creating new Hexo content.

## Build, Test, and Development Commands
Use the npm scripts defined in `package.json`:

- `npm run server` starts the local Hexo preview server.
- `npm run build` runs `hexo generate` and writes the static site to `public/`.
- `npm run clean` removes generated Hexo artifacts before a fresh build.
- `npm run deploy` publishes via `hexo-deployer-git` using `_config.yml`.

Use `npm ci` for reproducible installs when `node_modules/` is absent. Both
`package-lock.json` and `pnpm-lock.yaml` exist; avoid changing lockfiles unless
the package manager decision is intentional.

## Coding Style & Naming Conventions
Markdown posts should use clear front matter with `title`, `date`,
`categories`, and `tags`, matching existing posts in `source/_posts/`. Prefer
lowercase descriptive slugs such as `linux-power-management.md`; keep existing
underscore patterns only when they are already part of a topic name. Keep
Markdown headings hierarchical and examples fenced with language tags. Stylus
customizations should stay small and focused in `source/css/custom.styl`.

## Testing Guidelines
There is no dedicated automated test suite in this checkout. Treat
`npm run build` as the required validation for content, config, and style
changes. For visual changes, also run `npm run server` and inspect the affected
pages locally before opening a pull request.

## Commit & Pull Request Guidelines
Local Git history is unavailable in this checkout, so use concise imperative
commit messages, for example `docs: add contributor guide` or
`content: update Linux power management post`. Pull requests should describe the
content or config change, list validation performed, link related issues when
available, and include screenshots for visible layout or theme changes.

## Security & Configuration Tips
Do not commit secrets, tokens, `.env` files, or private deployment credentials.
Keep deployment targets in `_config.yml` reviewable and avoid editing generated
files under `public/` or `.deploy_git/` by hand.
