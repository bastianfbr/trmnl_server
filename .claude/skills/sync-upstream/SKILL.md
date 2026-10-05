---
name: sync-upstream
description: Update this fork to the latest usetrmnl/byos_next release — fetch upstream, merge on a branch, reconcile local recipes/docs, verify, open a PR (merge commit, never squash). Use when asked to "update to the latest version", "sync with upstream", or "mettre à jour depuis byos_next".
---

# Sync with upstream byos_next

Follow the "Staying in sync with upstream" and "Deployment" sections of `CLAUDE.md` — they are the source of truth. Steps:

1. **Prep**
   - `git remote -v` — add `upstream` (`https://github.com/usetrmnl/byos_next.git`) if missing.
   - `git fetch upstream`, then check `git merge-base main upstream/main` returns a commit. If it returns nothing, history has been broken (likely a squash merge) — stop and tell the user before doing anything.
   - Note versions: `package.json` `version` on `main` vs `upstream/main`, and `git log --oneline main..upstream/main | wc -l`.

2. **Merge on a branch**: `git checkout -b upgrade/upstream-<version>` then `git merge upstream/main`.
   - Conflicts in `app/(app)/recipes/screens/birthday-menu*` and `starmeteo/` → keep ours, but adapt them if upstream changed the `RecipeDefinition` contract (`lib/recipes/`).
   - `README.md`, `CLAUDE.md` → keep ours, hand-port upstream doc fixes that matter.
   - Everything else → take upstream's version.
   - `data/trmnl/models.json` → upstream's version, never a live-refreshed copy.

3. **Verify**: `pnpm install`, `pnpm generate:sql`, `pnpm generate:recipes`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`. Then run the dev server and check the dashboard, the recipes gallery (personal recipes present) and one recipe through `/api/bitmap`.
   - Remember local `.env` = production Neon DB.

4. **Migrations**: list new files in `migrations/` vs the previous version. Tell the user which ones need applying to prod (Initialize button) **before** the merge reaches `main`. Do not run them yourself without explicit approval.

5. **PR**: push the branch to `origin`, `gh pr create --base main`. In the PR body, list new migrations and remind: **merge with a merge commit, not squash**. Before committing, `git diff main -- data/trmnl/models.json` must be empty unless intentional.

6. **After merge**: Vercel deploys `main` automatically; confirm https://trmnlbadmax.vercel.app/ loads and shows the new version bottom-left. Update the version/date line in `CLAUDE.md`.
