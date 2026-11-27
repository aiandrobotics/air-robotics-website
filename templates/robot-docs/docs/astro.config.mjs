import { createAirStarlightConfig } from '@air-robotics/docs-theme';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  integrations: [
    starlight(
      createAirStarlightConfig({
        title: 'Robot Docs',
        description: 'Standalone Air Robotics documentation.',
        githubUrl: 'https://github.com/aiandrobotics',
        sidebar: [
          {
            label: 'Documentation',
            items: [{ autogenerate: { directory: '.' } }],
          },
        ],
      }),
    ),
  ],
});
