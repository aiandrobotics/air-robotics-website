import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ALLOWED_STATUSES = new Set(['Coming Soon', 'Beta', 'Active']);

/**
 * Validate and normalize parsed robots.yaml content.
 * @param {unknown} raw
 */
export function validateRobotsManifest(raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.robots)) {
    throw new Error('Invalid robots manifest: top-level "robots" must be an array.');
  }

  const seenSlugs = new Set();
  const normalized = [];

  for (const [index, entry] of raw.robots.entries()) {
    const label = `robots[${index}]`;
    if (!entry || typeof entry !== 'object') {
      throw new Error(`Invalid ${label}: entry must be an object.`);
    }

    const { slug, name, status, tagline, summary, repo } = entry;

    if (typeof slug !== 'string' || !SLUG_PATTERN.test(slug)) {
      throw new Error(
        `Invalid ${label}.slug "${String(slug)}": must be lowercase kebab-case (a-z, 0-9, hyphens).`,
      );
    }
    if (seenSlugs.has(slug)) {
      throw new Error(`Duplicate robot slug "${slug}" in robots manifest.`);
    }
    seenSlugs.add(slug);

    for (const [field, value] of Object.entries({ name, tagline, summary, repo })) {
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(`Invalid ${label}.${field}: must be a non-empty string.`);
      }
    }

    if (typeof status !== 'string' || !ALLOWED_STATUSES.has(status)) {
      throw new Error(
        `Invalid ${label}.status "${String(status)}": must be one of ${[...ALLOWED_STATUSES].join(', ')}.`,
      );
    }

    const syncEnabled = Boolean(entry.syncEnabled ?? false);
    const localPath = typeof entry.localPath === 'string' ? entry.localPath.trim() : undefined;
    const docsPath =
      typeof entry.docsPath === 'string' && entry.docsPath.trim().length > 0
        ? entry.docsPath.trim()
        : 'docs/src/content/docs';
    const assetsPath =
      typeof entry.assetsPath === 'string' && entry.assetsPath.trim().length > 0
        ? entry.assetsPath.trim()
        : undefined;
    const ref =
      typeof entry.ref === 'string' && entry.ref.trim().length > 0 ? entry.ref.trim() : 'main';

    if (syncEnabled && !localPath && !repo.startsWith('https://')) {
      throw new Error(
        `Invalid ${label}: syncEnabled requires either a localPath or an https:// repo URL.`,
      );
    }

    const highlights = Array.isArray(entry.highlights)
      ? entry.highlights.map((item, i) => {
          if (typeof item !== 'string' || item.trim().length === 0) {
            throw new Error(`Invalid ${label}.highlights[${i}]: must be a non-empty string.`);
          }
          return item.trim();
        })
      : [];

    const docsHref =
      typeof entry.docsHref === 'string' && entry.docsHref.trim().length > 0
        ? entry.docsHref.trim()
        : syncEnabled
          ? `/docs/${slug}/`
          : '/docs/';

    normalized.push({
      slug,
      name: name.trim(),
      status,
      tagline: tagline.trim(),
      summary: summary.trim(),
      repo: repo.trim(),
      ref,
      docsPath,
      assetsPath,
      localPath,
      syncEnabled,
      docsHref,
      highlights,
    });
  }

  return normalized;
}

/**
 * Read, parse, and validate a robots.yaml manifest file.
 * @param {string} manifestPath
 */
export function loadRobotsManifest(manifestPath) {
  const resolved = path.resolve(manifestPath);
  const content = fs.readFileSync(resolved, 'utf8');
  const parsed = parse(content);
  return {
    manifestDir: path.dirname(resolved),
    robots: validateRobotsManifest(parsed),
  };
}
