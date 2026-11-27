# Validation

## Required Checks

All checks below must exit with code `0`:

1. **Standalone template build verification**:
   Copy `templates/robot-docs/docs` to a temporary directory, install dependencies, and run `pnpm check && pnpm build` to confirm it builds cleanly standalone with `@air-robotics/docs-theme`.
2. **Template aggregation verification**:
   Sync `templates/robot-docs` into `air-robotics-website` via `scripts/sync-robot-docs.mjs --manifest <temp-manifest>` and build `air-robotics-website`, confirming `/docs/<slug>/index.html` and `/docs/<slug>/getting-started/index.html` are generated cleanly.
3. **`air-robot-docs` plugin verification in `sathyavikram/agent-plugins`**:
   - Confirm directory layout, plugin manifest, and `SKILL.md` frontmatter match existing plugins in `https://github.com/sathyavikram/agent-plugins.git`.
   - Confirm YAML syntax of `templates/robot-docs/.github/workflows/docs.yml`.
4. **Main repo checks remain green**:
   ```bash
   pnpm test:aggregation && pnpm sync:docs && pnpm lint && pnpm check && pnpm build
   ```

## Manual Review

- Confirm `SKILL.md` in `air-robot-docs` gives an agent everything needed to bootstrap a compliant standalone robot docs repo without guessing versions, paths, or CI event names.
- Confirm `templates/robot-docs/docs/package.json` references `@air-robotics/docs-theme` cleanly and has no leftover `node_modules/` or `dist/` committed.

## Merge Criteria

- All **Required Checks** pass with zero errors.
- `air-robot-docs` plugin is committed and pushed cleanly to `https://github.com/sathyavikram/agent-plugins.git`.
- `air-robotics-website` changes deploy cleanly to `dev.air-robotics.ai` and promote to `air-robotics.ai`.
