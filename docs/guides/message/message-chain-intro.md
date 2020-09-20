---
id: message-chain-intro
title: 初识消息链(Message Chain)
sidebar_label: 初识消息链
---

在 `mirai-core` 的设计中, `mamoe` 的开发者们使用的不是一串字符串, 而是一个列表来表示消息.
这可能有些反直觉:

> 消息难道不是 "一串字符" 吗?

确实, 无论哪里的人都不可避免的需要使用文字来表达自己想表达的意思, 即使使用语音也是如此:
难道你所使用的语言没有可印刷的文字形式吗?
没有人会一直使用表情包来表达自己心中所想, 除非ta本身就苍白无力到只能通过表情包给自己的意思增上几分色彩.

> 那么为什么非要用对象列表而不是字符串呢: 一切看起来都很合情合理啊?

因为即使是人能看懂字符串, 机器却很难处理: 机器需要使用正则匹配, 需要解析, 判断解析后得到的数据是否合法,
需要面对各种奇奇怪怪的字符串....人和人本身交流就非常容易 "`throw error`" 或是 "`warning.warn`", 何况是机器呢?

消息链(`Message Chain`) 的设计即是出自以上的苏格拉底式的发问与回答, 于是,
`Graia Framework` 和 `mirai` 一同采用了这一设计.

## 结构简述

:::warning

此处所提到的数据结构据已知情况, 仅 `Graia Framework` 使用了这一设计,
该文档不保证其他框架是否使用了这一设计, 若未使用, 则该部分对你而言可能**没有参考价值**!

:::

:::note

 - 你可以在模块 `graia.application.message.chain` 处找到 `MessageChain` 的类定义;
 - 你可以在模块 `graia.application.message.element` 处找到以下数据结构的定义:
    - `Element`, 消息元素, 以下类型皆继承自本类
    - `InternalElement`, 内部态消息元素
    - `ExternalElement`, 外部态消息元素
    - `ShadowElement`, 模拟态消息元素(暂定译名)

:::

和上述一致, `MessageChain` 确实是一个对象列表: 如果要用 Python 的 `type hint` 表达它,
它可以被看作 `List[Element]`, 用于承载各种类型的消息元素.

消息元素分为 "内部态", "外部态" 和一种特殊的 "模拟态",
一般来讲开发者只需要调用内部态消息元素的各式类方法或是直接实例化即可.
内部态, 外部态和模拟态的消息元素都有一个 是否可被发送(`sendable`) 的属性,
这主要以以下几个指标判断是否可以发送:

 - 内部态: 内部态的类定义是否重写了 `toExternal` 方法.  
   若没有重写, 则该内部态无法转换为外部态进行发送.
 - 外部态: 皆可发送
 - 模拟态: 理论上皆可发送, 视实际定义而定

我们定义了以下消息元素:

:::note

这些消息元素可以从 `graia.application.message.elements.internal` 处导入.

:::

> # TODO: Internal Message Element 补全 & API 描述组件