export interface RobotCatalogEntry {
  slug: string;
  name: string;
  status: 'Coming Soon' | 'Active' | 'Beta';
  tagline: string;
  summary: string;
  docsHref: string;
  repoUrl: string;
  highlights: readonly string[];
}

export const ROBOTS: readonly RobotCatalogEntry[] = [
  {
    slug: 'fabrica',
    name: 'Fabrica',
    status: 'Coming Soon',
    tagline: 'Open-source robotic automation platform built for makers and engineers.',
    summary:
      'Our first open-source robot project—complete with step-by-step assembly guides, 3D printable parts, electronics schematics, and firmware documentation.',
    docsHref: '/docs/',
    repoUrl: 'https://github.com/aiandrobotics',
    highlights: [
      '3D printable mechanical design',
      'Open-source firmware & control software',
      'Complete electronics schematics & BOM',
    ],
  },
] as const;
