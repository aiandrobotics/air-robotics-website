import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';
import { validateRobotsManifest } from './lib/robots-manifest.mjs';
import { syncRobotDocs } from './sync-robot-docs.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(REPO_ROOT, 'site', 'dist');

function testManifestValidation() {
  assert.throws(
    () => validateRobotsManifest({}),
    /top-level "robots" must be an array/,
    'Expected missing robots array to fail validation',
  );

  assert.throws(
    () =>
      validateRobotsManifest({
        robots: [
          {
            slug: 'Invalid_Slug',
            name: 'Bad',
            status: 'Active',
            tagline: 't',
            summary: 's',
            repo: 'https://github.com/aiandrobotics/bad',
          },
        ],
      }),
    /lowercase kebab-case/,
    'Expected non-kebab slug to fail validation',
  );

  assert.throws(
    () =>
      validateRobotsManifest({
        robots: [
          {
            slug: 'dup-bot',
            name: 'Dup 1',
            status: 'Active',
            tagline: 't',
            summary: 's',
            repo: 'https://github.com/aiandrobotics/dup-1',
          },
          {
            slug: 'dup-bot',
            name: 'Dup 2',
            status: 'Active',
            tagline: 't',
            summary: 's',
            repo: 'https://github.com/aiandrobotics/dup-2',
          },
        ],
      }),
    /Duplicate robot slug/,
    'Expected duplicate slugs to fail validation',
  );

  console.log('[test-aggregation] Manifest validation checks passed.');
}

function testEndToEndFixtureAggregation() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'air-aggregation-test-'));
  const fixtureRepo = path.join(tempRoot, 'pilot-bot-repo');
  const fixtureDocs = path.join(fixtureRepo, 'docs', 'src', 'content', 'docs');
  const fixtureAssets = path.join(fixtureRepo, 'docs', 'public');
  const tempManifest = path.join(tempRoot, 'robots.yaml');

  try {
    fs.mkdirSync(fixtureDocs, { recursive: true });
    fs.mkdirSync(fixtureAssets, { recursive: true });

    fs.writeFileSync(
      path.join(fixtureDocs, 'index.mdx'),
      `---
title: Pilot Bot Overview
description: Automated aggregation test fixture.
---

Welcome to **Pilot Bot** standalone documentation synced via manifest.
`,
      'utf8',
    );

    fs.writeFileSync(
      path.join(fixtureDocs, 'setup.mdx'),
      `---
title: Pilot Bot Setup
description: Setup guide for Pilot Bot.
---

Step 1: Assemble the Pilot Bot frame.
`,
      'utf8',
    );

    fs.writeFileSync(path.join(fixtureAssets, 'spec.txt'), 'pilot-bot-asset-ok\n', 'utf8');

    const manifestDoc = {
      robots: [
        {
          slug: 'pilot-bot',
          name: 'Pilot Bot',
          status: 'Active',
          tagline: 'Automated aggregation fixture robot.',
          summary: 'Proves adding a robot to robots.yaml integrates its docs with zero code edits.',
          repo: 'https://github.com/aiandrobotics/pilot-bot',
          ref: 'main',
          localPath: fixtureRepo,
          docsPath: 'docs/src/content/docs',
          assetsPath: 'docs/public',
          syncEnabled: true,
          highlights: ['Auto-synced docs', 'Auto-generated Starlight sidebar'],
        },
      ],
    };

    fs.writeFileSync(tempManifest, stringify(manifestDoc), 'utf8');

    syncRobotDocs(tempManifest);

    execFileSync('pnpm', ['build'], { cwd: REPO_ROOT, stdio: 'inherit' });

    const indexHtmlPath = path.join(DIST_DIR, 'docs', 'pilot-bot', 'index.html');
    const setupHtmlPath = path.join(DIST_DIR, 'docs', 'pilot-bot', 'setup', 'index.html');
    const assetPath = path.join(DIST_DIR, 'robots', 'pilot-bot', 'spec.txt');
    const catalogHtmlPath = path.join(DIST_DIR, 'robots', 'index.html');

    assert.ok(fs.existsSync(indexHtmlPath), 'Expected /docs/pilot-bot/index.html to be built');
    assert.ok(
      fs.existsSync(setupHtmlPath),
      'Expected /docs/pilot-bot/setup/index.html to be built',
    );
    assert.ok(fs.existsSync(assetPath), 'Expected /robots/pilot-bot/spec.txt asset to be copied');

    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    assert.match(indexHtml, /Pilot Bot Overview/, 'Expected synced doc content in HTML output');

    const catalogHtml = fs.readFileSync(catalogHtmlPath, 'utf8');
    assert.match(catalogHtml, /Pilot Bot/, 'Expected Pilot Bot in /robots/ catalog');
    assert.match(
      catalogHtml,
      /\/docs\/pilot-bot\//,
      'Expected link to /docs/pilot-bot/ in catalog',
    );

    console.log('[test-aggregation] End-to-end fixture aggregation test passed.');
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
    // Restore default robots.yaml sync state
    syncRobotDocs(path.join(REPO_ROOT, 'robots.yaml'));
  }
}

testManifestValidation();
testEndToEndFixtureAggregation();
