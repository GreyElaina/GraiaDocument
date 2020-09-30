module.exports = {
  docs: [
    "intro",
    {
      type: 'category',
      label: '入门',
      items: [
        'guides/installation',
        'guides/about-config',
        {
          type: 'category',
          label: "消息",
          items: [
            'guides/message/message-intro',
            'guides/message/message-chain-intro'
          ]
        }
      ],
    },
    {
      type: 'category',
      label: "Broadcast Control",
      items: [
        'broadcast-control/bcc-about',
        'broadcast-control/design/bcc-design-dispatcher'
      ]
    }
  ],
};