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
        },
        {
          type: "category",
          label: "特性",
          items: [
            'guides/features/interrupt/interrupt-readme',
            'guides/features/kanata/kanata-readme',
            'guides/features/components-selector',
            'guides/features/template-readme',
            'guides/features/custom-logger'
          ]
        }
      ],
    },
    {
      type: 'category',
      label: "Broadcast Control Old-Docs",
      items: [
        'broadcast-control-old/bcc-about',
        'broadcast-control-old/bcc-custom-event',
        'broadcast-control-old/bcc-interrupt',
        'broadcast-control-old/bcc-inline-cache',
        'broadcast-control-old/design/bcc-design-dispatcher'
      ]
    },
    {
      type: 'category',
      label: "Saya",
      items: [
        'saya/saya-index',
      ]
    },
    {
      type: 'category',
      label: "Broadcast Guide",
      items: [
        'broadcast/broadcast-index',
        {
          type: 'category',
          label: "Basic",
          items: [
            'broadcast/basic/broadcast-basic-getting-start',
          ]
        },
      ]
    }
  ],
};