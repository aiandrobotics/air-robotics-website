import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://air-robotics.ai',
  output: 'static',
  integrations: [
    starlight({
      title: 'Air Robotics',
      description: 'Unified documentation hub for Air Robotics open-source robots.',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/aiandrobotics',
        },
      ],
      customCss: ['./src/styles/starlight-custom.css'],
      sidebar: [
        {
          label: 'Documentation',
          items: [{ label: 'Overview', slug: 'docs' }],
        },
      ],
    }),
  ],
});
