---
id: broadcast-control-basic-getting-start
title: 初次见面
sidebar-title: 初次见面
---

## Installation

首先, 我们需要安装 `graia-broadcast`:

```bash
pip install graia-broadcast
```

使用 poetry:

```bash
poetry add graia-broadcast
```

## Prepare

在程序中导入主实现类 `Broadcast` 和前置标准库 `asyncio`:

```py
import asyncio
from graia.broadcast import Broadcast
```

获取事件循环, 并实例化 `Broadcast`:

```py
loop = asyncio.get_event_loop()
broadcast = Broadcast(loop=loop)
```

由于分发事件的方式是使用 `loop.create_task`, 所以 `Broadcast` 需要依附于一个正在运行的 `loop` 才能使用,
通常你可以通过 `loop.run_until_complete` 或者 `loop.run_forever` 方法运行事件循环.

:::tip
针对 `Graia Application` 用户: 当你执行 `GraiaMiraiApplication.launch_blocking` 方法时,
等同于上面的方式.
:::

## Create a Event

导入 `BaseEvent` 和 `BaseDispatcher`:

```py
from graia.broadcast.entities.event import BaseEvent
from graia.broadcast.entities.dispatcher import BaseDispatcher
```

声明一个继承了 `BaseEvent` 的类, 内部需包含一继承了 `BaseDispatcher`, 名为 `Dispatcher` 的类:

```py
class ExampleEvent(BaseEvent):
    class Dispatcher(BaseDispatcher):
        async def catch(self, interface: DispatcherInterface):
            pass
```

这时, 你可以通过 `Broadcast.findEvent` 方法检查事件声明是否有效:

```py
print(Broadcast.findEvent("ExampleEvent"))
# 传入事件类的名称, 若返回为 None, 则事件声明无效
```

## Ensure a event receiver

你可以通过使用装饰器方法 `Broadcast.receiver` 声明一个事件的监听:

```py
@broadcast.receiver(ExampleEvent) # 传入字符串 "ExampleEvent" 效果一样
async def event_receiver(event: ExampleEvent):
    print(event)
```

你需要也仅需要声明类型注解为 `ExampleEvent` 才能获取到事件的类实例.

## Create and broadcast an event

创建事件就是实例化事件类, 在这里, `ExampleEvent` 只需要简单的实例化就好:

```py
event = ExampleEvent()
```

然后通过 `Broadcast.postEvent` 方法即可广播事件到监听器:

```py
broadcast.postEvent(event) # 会使上文中的 event_receiver 打印出事件类.
```

## Modify default dispatcher

修改 `ExampleEvent.Dispatcher` 可以改变执行时分配给监听器声明的参数的值,
这需要通过重写 `BaseDispatcher.catch` 方法, 访问传入的 `DispatcherInterface` 实例实现:

```py
class ExampleEvent(BaseEvent):
    class Dispatcher(BaseDispatcher):
        @staticmethod
        async def catch(interface):
            pass
```

:::tip
这里的 `catch` 需定义为一异步方法, 且需要使用 `staticmethod` 装饰器.
:::