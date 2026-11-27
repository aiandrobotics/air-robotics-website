import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createAirStarlightConfig } from '@air-robotics/docs-theme';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const robotSidebarPath = path.join(__dirname, 'src', 'generated', 'robot-sidebar.json');
const robotSidebar = fs.existsSync(robotSidebarPath)
  ? JSON.parse(fs.readFileSync(robotSidebarPath, 'utf8'))
  : [];

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
          ...robotSidebar,
        ],
      }),
    ),
  ],
});
