# Mission

## Vision

Provide a clean, unified web presence for **Air Robotics** at [air-robotics.ai](https://air-robotics.ai) that showcases every robot and brings all robot documentation together in one cohesive portal—while allowing each robot team to author, preview, and maintain its documentation independently in its own repository.

## Core Principles

1. **Single Unified Portal, Independent Robot Projects**
   - The main website (`air-robotics-website`) presents Air Robotics, displays the robot catalog, and aggregates documentation from each robot repository at build time.
   - Each robot lives in its own separate GitHub repository with its own documentation that can run and be previewed standalone without the main website.
   - Adding a new robot requires registering it in the manifest—the main website automatically pulls and integrates its docs.

2. **Consistent, Clean Brand Experience**
   - Every page—from the landing page and robot catalog to individual robot docs (whether viewed standalone or inside the main site)—shares one clean, cohesive Air Robotics look and feel via a shared theme package.
   - All website pages and robot documentation must be fully responsive and work cleanly across all devices and screen sizes (mobile, tablet, and desktop) with zero horizontal overflow.
   - Prioritize visual clarity, fast load times, and uncluttered navigation.

3. **Reproducible Infrastructure as Code**
   - All AWS infrastructure is defined declaratively in Terraform so environments can be recreated accurately and audited in version control.

4. **Safe, Automated Delivery (`dev` → `prod`)**
   - Two isolated environments exist: `dev` (`dev.air-robotics.ai`) and `prod` (`air-robotics.ai`).
   - Every change—whether to the main website or to a robot's docs—deploys automatically to `dev` first for verification.
   - Nothing reaches `prod` without passing through `dev` first and being promoted via `dev` → `main`.

## Initial v1 Scope

- Clean Air Robotics landing page, Company/About/Contact pages, and robot catalog linking to each robot's documentation.
- Shared Air Robotics theme package consumed by both the main site and standalone robot doc sites.
- Manifest-driven build-time aggregation of robot docs into the main site.
- Reusable robot-docs template plus the first robot repository (**Fabrica**) proving end-to-end standalone authoring and automatic main-site rebuilds.
- An `air-robot-docs` agent skill (packaged as a plugin in `https://github.com/sathyavikram/agent-plugins.git`) capturing all conventions, tech stack, and bootstrap/build instructions so agents can consistently create and maintain robot documentation repos.
- Terraform-managed AWS hosting and GitHub Actions CI/CD for `dev` and `prod`.

## Non-Goals (v1)

- Blog, changelog, or marketing CMS features.
- Authentication or IP-gated access control on `dev` (only search-engine noindex hygiene on `dev`).
- Server-side runtime backends or databases—the site is statically generated and served from S3 + CloudFront.
