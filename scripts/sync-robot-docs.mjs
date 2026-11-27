import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRobotsManifest } from './lib/robots-manifest.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const SITE_DIR = path.join(REPO_ROOT, 'site');
const DOCS_MOUNT_ROOT = path.join(SITE_DIR, 'src', 'content', 'docs', 'docs');
const PUBLIC_ROBOTS_ROOT = path.join(SITE_DIR, 'public', 'robots');
const GENERATED_DIR = path.join(SITE_DIR, 'src', 'generated');

function parseArgs(argv) {
  let manifestPath = path.join(REPO_ROOT, 'robots.yaml');
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--manifest' && argv[i + 1]) {
      manifestPath = path.resolve(argv[i + 1]);
      i += 1;
    }
  }
  return { manifestPath };
}

function buildAuthenticatedRepoUrl(repoUrl) {
  const token = process.env.ROBOTS_READ_TOKEN || process.env.GITHUB_TOKEN;
  if (!token || !repoUrl.startsWith('https://github.com/')) {
    return repoUrl;
  }
  return repoUrl.replace('https://github.com/', `https://x-access-token:${token}@github.com/`);
}

function cleanSyncedDirectories() {
  if (fs.existsSync(DOCS_MOUNT_ROOT)) {
    for (const entry of fs.readdirSync(DOCS_MOUNT_ROOT, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        fs.rmSync(path.join(DOCS_MOUNT_ROOT, entry.name), { recursive: true, force: true });
      }
    }
  }
  fs.rmSync(PUBLIC_ROBOTS_ROOT, { recursive: true, force: true });
}

function syncRobot(robot, manifestDir) {
  let tempDir;
  let sourceRoot;

  try {
    if (robot.localPath) {
      sourceRoot = path.resolve(manifestDir, robot.localPath);
      if (!fs.existsSync(sourceRoot)) {
        throw new Error(`Local path not found for robot "${robot.slug}": ${sourceRoot}`);
      }
    } else {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `air-robot-${robot.slug}-`));
      const cloneUrl = buildAuthenticatedRepoUrl(robot.repo);
      execFileSync(
        'git',
        ['clone', '--depth', '1', '--branch', robot.ref, '--single-branch', cloneUrl, tempDir],
        { stdio: 'pipe' },
      );
      sourceRoot = tempDir;
    }

    const sourceDocsDir = path.join(sourceRoot, robot.docsPath);
    if (!fs.existsSync(sourceDocsDir)) {
      throw new Error(`Docs directory "${robot.docsPath}" not found for robot "${robot.slug}".`);
    }

    const hasIndex =
      fs.existsSync(path.join(sourceDocsDir, 'index.mdx')) ||
      fs.existsSync(path.join(sourceDocsDir, 'index.md'));
    if (!hasIndex) {
      throw new Error(
        `Robot "${robot.slug}" docs directory must contain an index.md or index.mdx entrypoint.`,
      );
    }

    const targetDocsDir = path.join(DOCS_MOUNT_ROOT, robot.slug);
    fs.mkdirSync(targetDocsDir, { recursive: true });
    fs.cpSync(sourceDocsDir, targetDocsDir, { recursive: true });

    if (robot.assetsPath) {
      const sourceAssetsDir = path.join(sourceRoot, robot.assetsPath);
      if (fs.existsSync(sourceAssetsDir)) {
        const targetAssetsDir = path.join(PUBLIC_ROBOTS_ROOT, robot.slug);
        fs.mkdirSync(targetAssetsDir, { recursive: true });
        fs.cpSync(sourceAssetsDir, targetAssetsDir, { recursive: true });
      }
    }
  } finally {
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

export function syncRobotDocs(manifestPath = path.join(REPO_ROOT, 'robots.yaml')) {
  const { manifestDir, robots } = loadRobotsManifest(manifestPath);

  cleanSyncedDirectories();

  const sidebarGroups = [];
  for (const robot of robots) {
    if (!robot.syncEnabled) {
      console.log(`[sync-robot-docs] Skipping "${robot.slug}" (syncEnabled: false)`);
      continue;
    }

    console.log(`[sync-robot-docs] Syncing "${robot.slug}"...`);
    syncRobot(robot, manifestDir);
    sidebarGroups.push({
      label: robot.name,
      items: [{ autogenerate: { directory: `docs/${robot.slug}` } }],
    });
  }

  fs.mkdirSync(GENERATED_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(GENERATED_DIR, 'robots.json'),
    `${JSON.stringify(robots, null, 2)}\n`,
    'utf8',
  );
  fs.writeFileSync(
    path.join(GENERATED_DIR, 'robot-sidebar.json'),
    `${JSON.stringify(sidebarGroups, null, 2)}\n`,
    'utf8',
  );

  console.log(
    `[sync-robot-docs] Done (${robots.length} robot(s) in catalog, ${sidebarGroups.length} synced).`,
  );
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const { manifestPath } = parseArgs(process.argv.slice(2));
  syncRobotDocs(manifestPath);
}
