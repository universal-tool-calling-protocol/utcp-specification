import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Universal Tool Calling Protocol (UTCP)',
  tagline: 'A modern, flexible, and scalable standard for defining and interacting with tools across a wide variety of communication protocols',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://utcp.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'universal-tool-calling-protocol', // Usually your GitHub org/user name.
  projectName: 'utcp-specification', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          id: 'default',
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/universal-tool-calling-protocol/utcp-specification/tree/main/',
          showLastUpdateTime: true,
          includeCurrentVersion: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'about',
        path: 'about',
        routeBasePath: 'about',
        sidebarPath: './sidebarsAbout.ts',
        editUrl: 'https://github.com/universal-tool-calling-protocol/utcp-specification/tree/main/',
        showLastUpdateTime: true,
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: '/about/RFC',
            from: '/RFC',
          },
          {
            to: '/about/RFC',
            from: '/rfc',
          },
          {
            to: '/about/contributing',
            from: '/contributing',
          },
          {
            to: '/about/contributing',
            from: '/CONTRIBUTING',
          },
          {
            to: '/about/about-us',
            from: '/about',
          },
        ],
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/black-logo-square.png',
    navbar: {
      title: 'UTCP',
      logo: {
        alt: 'UTCP Logo',
        src: 'img/black-logo-square.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'index',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'doc',
          docId: 'about-us',
          position: 'left',
          label: 'About',
          docsPluginId: 'about',
        },
        {
          type: 'doc',
          docId: 'RFC',
          position: 'left',
          label: 'RFC',
          docsPluginId: 'about',
        },
        {
          to: '/registry',
          position: 'left',
          label: 'Registry',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          docsPluginId: 'default',
        },
        {
          href: 'https://github.com/universal-tool-calling-protocol',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Overview',
              to: '/docs',
            },
            {
              label: 'Provider Types',
              to: '/docs/providers/http',
            },
            {
              label: 'Implementation Guide',
              to: '/docs/implementation',
            },
            {
              label: 'UTCP vs MCP',
              to: '/docs/utcp-vs-mcp',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/universal-tool-calling-protocol',
            },
            {
              label: 'Issues',
              href: 'https://github.com/universal-tool-calling-protocol/utcp-specification/issues',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/universal-tool-calling-protocol/utcp-specification/discussions',
            },
          ],
        },
        {
          title: 'Specification',
          items: [
            {
              label: 'Repository',
              href: 'https://github.com/universal-tool-calling-protocol/utcp-specification',
            },
            {
              label: 'Releases',
              href: 'https://github.com/universal-tool-calling-protocol/utcp-specification/releases',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} UTCP Contributors. Distributed under the Apache 2.0 License.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
