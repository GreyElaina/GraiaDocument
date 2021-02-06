---
id: bcc-about
title: 关于 Broadcast Control
sidebar-title: 关于
---

:::note
`BCC` 是 `Broadcast Control`, 官方译名 "广播控制" 的缩写.
:::

## 什么是 Broadcast Control

在我们所处的世界是, 从抽象的角度上讲, 每时每刻, 包括我写这个文档的时候, 你读这段文字的时候,
在每一时刻都发生着无数的 "事件", 即 `Event`.

`Broadcast Control` 是基于 `Python` 标准库中模块 `asyncio` 的 观察者模式(`Observer Pattern`) 实现.
在该库中不仅包括完整的监听控制, 事件传播干涉等机制, 还有一套高层封装的 参数解析(`Argument Dispatch`) 实现.

## 为什么?

社区中已有的资源不能满足我们的需求:

 - 尽可能灵活, 简单的定义事件
 - 包含对 `pydantic` 的原生支持
 - 能够通过类似 `fastapi` 通过定义参数类型注解获取事件发生环境中的相应的值
 - 开发较为简单, 且具有良好扩展性的参数解析器设计

于是我们设计了 `Broadcast Control`, 这个伟大的库作为 `Graia Project` 中的重要部分,
向我们提供了无限的可能性, 也正如我们的 slogan: `Creation & Exploration`.