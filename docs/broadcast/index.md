---
id: broadcast-index
title: "写在前面: 这是什么?"
sidebar-title: Introduction
---

Broadcast Control 是一套完整的, 基于 `asyncio` 异步机制, 提供具有独创性的 Dispatcher API 的事件系统实现.
同作为开发者, 我们需要协定以下共识:

 - Broadcast Control 现仅支持 Python 的 `3.7` 及其以上版本
 - 本文档撰写时, Broadcast Control 发布在 PyPI 上的版本为 `0.6.4`, 现在的版本为 [[PyPI](https://pypi.org/project/graia-broadcast/)](https://img.shields.io/pypi/v/graia-broadcast).
 - **若无特殊说明, 本文档针对 `graia-broadcast==0.6.4` 进行说明.**
 - 在阅读本文档时, 请先对 Python 的异步编程有一定了解(例如 `asyncio`, `gevent` 等), 若没有相关的知识, 请先前往本文档的 [Asyncio 使用速成](/asyncio-basic).
 - Graia Project 为 NatriumLab 下的项目
 - 任何问题请前往 Github issue 处寻找解决方法或者提出 issue.
 - 什么, 你连 Python 都不会甚至不知道是什么? 我给您提个醒: <button onclick="window.close()">点此获得提醒</button>  
 这里选摘一段来自其他开发圈系的开发者的话:
 > 什么叫“降低门槛”？要我说，我已经很久没见到比国内MC圈的开发门槛还要低的圈子了，软件版和编程版的门槛已经低到不能再低了。至少对于我而言，我已经在无数个场合说过无数次了，学开发插件/Mod的时候，先花上几个月把Java学了，然后再学会很轻松。实际上呢？我接触过的连Java基本语法都没了解清楚就去学写插件/Mod的人，实在是太多太多了。Java实际上，甚至可以说是最简单的现代编程语言之一。至于多了解了解其他的编程语言，多学习学习一些计算机科学的知识，什么数据结构啊，设计模式啊，组成原理啊，这些本来应该是程序猿提升自我理应做的事情，对于他们来说，我真是想都不敢想。
 >
 > 作者：Yanbing Zhao
 > 链接：https://www.zhihu.com/question/63200488/answer/206584431
 > 来源：知乎
 > 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处
 - 本文档不包含任何与 `Graia Application` 有直接联系, 但文档内容是构建 `Graia Application` 的基础.
 - 如果你的代码水准连你自己都看不下去, 那建议先练练再用这个项目.
 - 保持代码的整洁高效.

最后, Welcome to brand new world.