import { createAirStarlightConfig } from '@air-robotics/docs-theme';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://air-robotics.ai',
  output: 'static',
  integrations: [
    starlight(
      createAirStarlightConfig({
        title: 'Air Robotics',
        description: 'Unified documentation hub for Air Robotics open-source robots.',
        sidebar: [
          {
            label: 'Documentation',
            items: [{ label: 'Overview', slug: 'docs' }],
          },
        ],
      }),
    ),
  ],
});
