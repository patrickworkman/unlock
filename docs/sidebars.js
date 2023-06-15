/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  docs: [
    {
      label: 'Getting Started',
      type: 'category',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'getting-started/README',
      },
      items: [
        {
          type: 'autogenerated',
          dirName: 'getting-started',
        },
      ],
    },
    {
      label: 'Core Protocol',
      type: 'category',
      link: {
        type: 'doc',
        id: 'core-protocol/README',
      },
      items: [
        {
          type: 'autogenerated',
          dirName: 'core-protocol',
        },
      ],
    },
    {
      label: 'Tools',
      type: 'category',
      link: {
        //added link tag to display sidebar on tools page
        type: 'doc',
        id: 'tools/README',
      },
      items: [
        'tools/dashboard',
        {
          type: 'category',
          label: 'Sign in with ethereum',
          link: {
            type: 'doc',
            id: 'tools/sign-in-with-ethereum/README',
          },
          items: ['tools/sign-in-with-ethereum/unlock-accounts'],
        },
        {
          type: 'category',
          label: 'Checkout',
          link: {
            type: 'doc',
            id: 'tools/checkout/README',
          },
          items: [
            'tools/checkout/configuration',
            'tools/checkout/collecting-metadata',
          ],
        },
        'tools/unlock.js',
        'tools/paywall',

        {
          type: 'category',
          label: 'Locksmith',
          link: {
            type: 'doc',
            id: 'tools/locksmith/README',
          },
          items: [
            {
              type: 'link',
              href: '/api/locksmith',
              label: 'API',
            },
            'tools/locksmith/metadata',
            'tools/locksmith/webhooks',
          ],
        },
        {
          type: 'category',
          label: 'Subgraph',
          link: {
            type: 'doc',
            id: 'tools/subgraph/README',
          },
          items: ['tools/subgraph/entities', 'tools/subgraph/queries'],
        },
        'tools/hardhat-plugin',
        'tools/rpc-provider',
      ],
    },
    {
      label: 'Tutorials',
      type: 'category',
      link: {
        type: 'doc',
        id: 'tutorials/README',
      },
      items: [
        'tutorials/building-token-gated-applications',
        {
          label: 'Front-end',
          type: 'category',
          items: [
            'tutorials/front-end/locking-page',
            'tutorials/front-end/react-example',
            'tutorials/front-end/scaffold-eth',
            {
              label: 'Paywall',
              link: {
                type: 'doc',
                id: 'tutorials/front-end/paywall/README',
              },
              type: 'category',
              items: ['tutorials/front-end/paywall/magic'],
            },
          ],
        },
        {
          type: 'category',
          label: 'Back-end',
          items: [
            'tutorials/back-end/backend-locking-with-express.js',
            'tutorials/back-end/locksmith-webhooks',
          ],
        },
        {
          type: 'category',
          label: 'Smart Contracts',
          items: [
            'tutorials/smart-contracts/deploying-locally',
            'tutorials/smart-contracts/using-unlock-in-other-contracts',
            'tutorials/smart-contracts/ethers',
            'tutorials/smart-contracts/deploying-from-another-contract',
            {
              type: 'category',
              label: 'Unlock Hooks',
              link: {
                type: 'doc',
                id: 'tutorials/smart-contracts/hooks/README',
              },
              items: [
                'tutorials/smart-contracts/hooks/using-on-key-purchase-hook-to-password-protect',
              ],
            },
          ],
        },
      ],
    },
    {
      label: 'Governance',
      type: 'category',
      link: {
        type: 'doc',
        id: 'governance/README',
      },
      items: [
        {
          type: 'autogenerated',
          dirName: 'governance',
        },
      ],
    },
  ],
}

module.exports = sidebars
