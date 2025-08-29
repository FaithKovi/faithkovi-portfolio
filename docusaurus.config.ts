// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import githubTheme from 'prism-react-renderer/themes/github';
import draculaTheme from 'prism-react-renderer/themes/dracula';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Faith Kovi',
  tagline: 'Documentation Engineer | DevRel Enthusiast | Cloud Native Advocate',
  url: 'https://faithkovi.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/faith-kovi-logo-blue.svg',

  organizationName: 'FaithKovi', // GitHub username
  projectName: 'faithkovi-portfolio', // Repo name
  // deploymentBranch: 'gh-pages',
  trailingSlash: false,

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },

      navbar: {
        title: 'Faith Kovi',
        logo: {
          alt: 'Faith Kovi Logo',
          src: 'img/faith-kovi-logo-blue.svg',
          srcDark: 'img/faith-kovi-logo-transparent.svg', // Uncomment if you have a dark logo
        },
        items: [
          { to: '/', label: 'Home', position: 'left' },
          { to: '/about', label: 'About', position: 'left' },
          { to: '/projects', label: 'Projects', position: 'left' },
          { to: '/blog', label: 'Blog', position: 'left' },
          { to: '/contact', label: 'Contact', position: 'left' },
          {
            href: 'https://github.com/FaithKovi',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },

      footer: {
        style: 'dark',
        links: [
          {
            title: 'Portfolio',
            items: [
              { label: 'About', to: '/about' },
              { label: 'Projects', to: '/projects' },
              { label: 'Blog', to: '/blog' },
              { label: 'Contact', to: '/contact' },
            ],
          },
          {
            title: 'Connect',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/FaithKovi',
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/faith-kovi/',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Faith Kovi. Built with Docusaurus.`,
      },

      prism: {
        theme: githubTheme,
        darkTheme: draculaTheme,
      },
      

      metadata: [
        { name: 'description', content: 'Faith Kovi Portfolio - DevRel | Cloud Native | Documentation Engineer' },
        { name: 'keywords', content: 'Faith Kovi, DevRel, Documentation, Cloud Native, Technical Writer, Portfolio, Platform Engineering, Kubernetes, AWS' },
        { property: 'og:title', content: 'Faith Kovi Portfolio' },
        { property: 'og:description', content: 'Explore my projects, blogs, and experience in documentation and cloud native advocacy.' },
        { property: 'og:image', content: 'https://faithkovi.github.io/img/faith-kovi-headshot.jpg' }, // Replace with actual image
        { property: 'og:url', content: 'https://faithkovi.github.io/' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Faith Kovi Portfolio' },
        { name: 'twitter:description', content: 'Explore my projects, blogs, and experience in documentation and cloud native advocacy.' },
        { name: 'twitter:image', content: 'https://faithkovi.github.io/img/faith-kovi-headshot.jpg' }, // Replace with actual image
      ],
    }),

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false, // We’re not using documentation pages for this portfolio
        blog: false, //  Disable built-in blog
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
};

module.exports = config;
