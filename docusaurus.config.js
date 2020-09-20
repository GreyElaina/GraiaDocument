module.exports = {
  title: 'Graia Document',
  tagline: 'Graia Framework 的新版文档, 由开发者名义释出.',
  url: 'https://graia-document.vercel.app/',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'GraiaProject', // Usually your GitHub org/user name.
  projectName: 'Application', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Graia Document',
      links: [
        {
          to: 'docs/intro',
          activeBasePath: 'docs',
          label: '文档',
          position: 'left',
        },
        {
          href: 'https://github.com/GreyElaina/GraiaDocument',
          label: 'Repo on GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '旗下项目',
          items: [
            {
              label: 'Graia Application for Mirai',
              href: 'https://github.com/GraiaProject/Application'
            },
            {
              label: 'Broadcast Control',
              href: 'https://github.com/GraiaProject/BroadcastControl'
            }
          ]
        },
        {
          title: '社区 - Community',
          items: [
            {
              label: 'QQ Group',
              href: 'https://jq.qq.com/?_wv=1027&k=VXp6plBD',
            }
          ],
        },
        {
          title: '更多 - More',
          items: [
            {
              label: '开发日志',
              to: 'blog',
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Graia Project. 由 Docusaurus Ⅱ 强力驱动.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/GreyElaina/GraiaDocument/edit/master/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
