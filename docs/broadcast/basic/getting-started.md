---
id: broadcast-basic-getting-start
title: 起点与特性概览
sidebar-title: 一切的起点
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

你需要也仅需要声明类型注解为 `ExampleEvent` 就能获取到事件的类实例.

这里的 `event_receiver`, 我们称其为 "监听器(Listener)".

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

在事件广播, 而监听器监听到事件时, 会启动一个异步任务, 里面装着叫 "执行器(Executor)" 的玩意.  
执行器负责解析监听器的参数声明, 生成合适的参数, 并传给监听器执行.

在 Dispatcher 内, 我们可以获取到一个叫 `DispatcherInterface` 的玩意.  
而 Dispatcher 在原本的实现里, 本就是这玩意调用的它, 自然也要为它服务.
但我们只要通过返回值给他, 就算是服务了, 真是敷衍.

但是, 慢着, 如果我们真的直接 `return`, 那么会发生什么?
你可以试试执行下这段代码:

```py
import asyncio
from graia.broadcast import Broadcast
from graia.broadcast.entities.event import BaseEvent
from graia.broadcast.entities.dispatcher import BaseDispatcher

class ExampleEvent(BaseEvent):
    class Dispatcher(BaseDispatcher):
        @staticmethod
        async def catch(interface):
            return "alalalalalalalalalabalalalbal." # 随便什么值吧.

def test_func(s, r, u, z, j: str, k: int, l: float = 1): # 非常正常的函数...?
    print(f"{s=}, {r=}, {u=}, {z=}, {j=}, {k=}, {l=}")

loop = asyncio.get_event_loop()
broadcast = Broadcast(loop=loop)
loop.run_until_complete(broadcast.Executor(
    target=test_func,
    event=ExampleEvent(),
))
```

悲伤的返回:

```
s='alalalalalalalalalabalalalbal.', r='alalalalalalalalalabalalalbal.', u='alalalalalalalalalabalalalbal.', z='alalalalalalalalalabalalalbal.', j='alalalalalalalalalabalalalbal.', k='alalalalalalalalalabalalalbal.', l='alalalalalalalalalabalalalbal.'
```

虽然有点搞笑, 但这也告诉我们: 绝对不能随随便便就在 Dispatcher 里面写一个值的返回.

而这是因为在解析参数声明时, 执行器会把一个一个的参数声明, 放到 Dispatcher Interface 里面,
然后让它去一个一个调用 Dispatcher, 进而完成对参数的解析.

一般来说, 我们都希望 Dispatcher 在某个参数上起作用, 但是这句话还能扩展为: **在满足特定条件的参数声明上起作用**.
而要检查这些条件是否满足, 我们就需要调用 Dispatcher Interface 提供的各式接口:

|接口名称|接口类型|备注|
|:-:|:-:|:-:|
|`event`|`BaseEvent`|触发当前监听器的事件实例|
|`name`|`str`|正在处理的参数的名称|
|`annotation`|`Any`|正在处理的参数, 它的类型注解|
|`default`|`Any`|正在处理的参数所设的默认值|

:::note
这些接口, 都是通过一个堆栈实现 + `property`实现的.
:::

通过访问这些接口, 取得执行环境中的值, 我们就可以合理的解析参数,
汇总信息.

下面这段代码, 改编自上面的那段, 但是它运行正确.

```py
import asyncio
from graia.broadcast import Broadcast
from graia.broadcast.entities.event import BaseEvent
from graia.broadcast.entities.dispatcher import BaseDispatcher

class ExampleEvent(BaseEvent):
    class Dispatcher(BaseDispatcher):
        @staticmethod
        async def catch(interface):
            # highlight-start
            if interface.annotation is int: # 判断类型注解是否为 int
                return 1
            # highlight-end

def test_func(k: int): # 非常正常的函数...?
    print(f"{k=}")

loop = asyncio.get_event_loop()
broadcast = Broadcast(loop=loop)
loop.run_until_complete(broadcast.Executor(
    target=test_func,
    event=ExampleEvent(),
))
```

将会输出:

```
k=1
```

这才是合理的返回.

## Inject Dispatcher in receiver

我们也同样实现了在 `Broadcast.receiver` 方法里面塞 Dispatcher 的魔法,
这些 Dispatcher 会且仅会在对应的监听器~~作妖~~起作用.  
顺便, 这些 Dispatcher 最好为类的实例.

```py
class ExampleEvent(BaseEvent):
    class Dispatcher(BaseDispatcher):
        @staticmethod
        async def catch(interface):
            if interface.annotation is int:
                return 1

class ExampleDispatcher(BaseDispatcher):
    def __init__(self, text: str):
        self.text = text

    async def catch(self, interface: DispatcherInterface):
        if interface.name == "brain_power":
            return "OOOOOOOOOAAAAEEAAE"

@broadcast.receiver("ExampleEvent", dispatchers=[
    ExampleDispatcher()
])
def test_func(brain_power: int): # 注意: 我们同时提供了特定的参数名称和特殊的类型注解
    print(f"brain_power={brain_power}")
```

广播事件, 打印结果为:

```
brain_power=OOOOOOOOOAAAAEEAAE
```

因为我们设计的是 "局部特殊规则优先"(就先这样说吧),
在局部的, 被显式指定的, 要比在更大范围的, 隐式的优先, 前者会覆盖后者的行为, 在这里, 我们在声明监听器时, 显式的传入了一个覆盖了原先行为的 Dispatcher,
所以最后, `brain_power` 的值才会是文本 `"OOOOOOOOOAAAAEEAAE"` 而不是 整数 `1`; 这也是 `Dispatcher Inject`,
即 "解析器注入" 的最简示例.