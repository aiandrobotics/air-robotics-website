export interface AirNavItem {
  label: string;
  href: string;
}

export const AIR_BRAND = {
  name: 'AIR',
  fullName: 'Air Robotics',
  domain: 'https://air-robotics.ai',
  contactEmail: 'contact@air-robotics.ai',
  githubOrgUrl: 'https://github.com/aiandrobotics',
  tagline: 'Dream Big. Build Robots. Create Moonshots.',
} as const;

export const AIR_NAV_ITEMS: readonly AirNavItem[] = [
  { label: 'Robots', href: '/robots/' },
  { label: 'Docs', href: '/docs/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const;

export interface AirStarlightOptions {
  title: string;
  description?: string;
  githubUrl?: string;
  customCss?: string[];
  sidebar?: unknown[];
}

export function createAirStarlightConfig(options: AirStarlightOptions) {
  const {
    title,
    description = 'Unified documentation hub for Air Robotics open-source robots.',
    githubUrl = AIR_BRAND.githubOrgUrl,
    customCss = [],
    sidebar = [],
  } = options;

  return {
    title,
    description,
    social: [
      {
        icon: 'github' as const,
        label: 'GitHub',
        href: githubUrl,
      },
    ],
    customCss: ['@air-robotics/docs-theme/starlight.css', ...customCss],
    sidebar,
  };
}
