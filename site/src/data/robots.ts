import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

export interface RobotCatalogEntry {
  slug: string;
  name: string;
  status: 'Coming Soon' | 'Active' | 'Beta';
  tagline: string;
  summary: string;
  docsHref: string;
  repoUrl: string;
  syncEnabled: boolean;
  highlights: readonly string[];
}

interface RawRobotRecord {
  slug: string;
  name: string;
  status: 'Coming Soon' | 'Active' | 'Beta';
  tagline: string;
  summary: string;
  repo: string;
  docsHref?: string;
  syncEnabled?: boolean;
  highlights?: string[];
}

function resolveFirstExisting(candidates: readonly string[]): string | undefined {
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function loadRobots(): readonly RobotCatalogEntry[] {
  const cwd = process.cwd();
  const generatedPath = resolveFirstExisting([
    path.resolve(cwd, 'src/generated/robots.json'),
    path.resolve(cwd, 'site/src/generated/robots.json'),
  ]);
  const rootManifestPath = resolveFirstExisting([
    path.resolve(cwd, '../robots.yaml'),
    path.resolve(cwd, 'robots.yaml'),
  ]);

  let rawRobots: RawRobotRecord[] = [];

  if (generatedPath) {
    rawRobots = JSON.parse(fs.readFileSync(generatedPath, 'utf8')) as RawRobotRecord[];
  } else if (rootManifestPath) {
    const parsed = parse(fs.readFileSync(rootManifestPath, 'utf8')) as {
      robots?: RawRobotRecord[];
    };
    rawRobots = parsed.robots ?? [];
  }

  return rawRobots.map((robot) => {
    const syncEnabled = Boolean(robot.syncEnabled ?? false);
    return {
      slug: robot.slug,
      name: robot.name,
      status: robot.status,
      tagline: robot.tagline,
      summary: robot.summary,
      docsHref: robot.docsHref ?? (syncEnabled ? `/docs/${robot.slug}/` : '/docs/'),
      repoUrl: robot.repo,
      syncEnabled,
      highlights: robot.highlights ?? [],
    };
  });
}

export const ROBOTS: readonly RobotCatalogEntry[] = loadRobots();
