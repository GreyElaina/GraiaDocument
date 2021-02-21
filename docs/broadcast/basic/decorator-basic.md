---
id: decorator-guide
title: 参数修饰器(Decorator)使用指导
sidebar-title: 参数修饰器(Decorator)
---

Dispatcher 在有时候还是缺少灵活性, 而 Decorator, 即参数修饰器就是设计来弥补这个问题的.

## Build a Decorator

Decorator 可简单称为一继承了 `Decorator` 的类, 但用于实际的是其实例.

从模块 `graia.broadcast.entities.decorator` 处导入基类 `Decorator`,
并实现其抽象方法 `target`.

:::tip
其实, `target` 在原来的声明中, 是作为属性存在的, 但是它的类型注解为 `Callable[[Any], Any]`,
因此, 我们可以直接在声明类时将 `target` 写作方法.

你可以在[这里](https://graiaproject.github.io/Application/graia/broadcast/entities/decorator.html)查看 `Decorator` 的类声明.
:::

举个例子, 我们已经有了这样的程序:

```py
import asyncio
from graia.broadcast import Broadcast
from graia.broadcast.entities.event import BaseEvent
from graia.broadcast.entities.dispatcher import BaseDispatcher

class ExampleEvent(BaseEvent):
    class Dispatcher(BaseDispatcher):
        @staticmethod
        async def catch(interface):
            if interface.annotation is "random_float":
                return random.random()

def test_func(k: "random_float"): # 非常正常的函数.
    print(f"{k=}")

loop = asyncio.get_event_loop()
broadcast = Broadcast(loop=loop)
loop.run_until_complete(broadcast.Executor(
    target=test_func,
    event=ExampleEvent(),
))
```

这个程序运行的非常正常, 你也许因此得到了成就感.

但有时候, 你想做个玄学执行:

 - 让 `k` 如果小于 `0.4` 的时候, 干脆置 `k` 为 `0`.

这个要求专门做个 Dispatcher 实在是杀鸡用牛刀, 并且你也许在整个程序中只在这里使用一次这样的逻辑,
这时, Decorator 就可以助你一臂之力了.

你可以声明如下的类:

```py
from graia.broadcast.interfaces.decorator import DecoratorInterface

class GodsChoice(Decorator):
    def target(self, interface: "DecoratorInterface"):
        if interface.return_value < 0.4: # 获取已经取得的参数值
            return 0
```

然后在声明执行函数时:

```py
def test_func(k: "random_float" = GodsChoice()):
    print(f"{k=}")
```

完成了, 当生成的 `k` 小于 `0.4` 时, 参数修饰器 `GodsChoice` 会将其置为 `0` 而非原值.

从这个范例中, 我们可以窥见 Decorator 的灵活与易用性.
`GodsChoice.target` 接受的 `interface` 类型为 `DecoratorInterface`, 和 `DispatcherInterface` 差不多,
也负责 Decorator 的调用.

:::tip
其实, `DecoratorInterface` 在代码实现中也是一个 `Dispatcher`,
但在实际的执行中会被隐式注入到 `DispatcherInterface` 调用顺序的第一位去,
也就是说, 无论什么时候, `Decorator` 都会被最先处理, 也保证了 `Decorator` 的执行机能.
:::

我们还可以通过 `DecoratorInterface` 的以下接口访问更多的数据:

|接口名称|类型|描述|
|:-:|:-:|:-:|
|`event`|`BaseEvent`|触发当前监听器的事件实例|
|`name`|`str`|正在处理的参数的名称|
|`annotation`|`Any`|正在处理的参数, 它的类型注解|
|`default`|`Literal[None]`|恒为 `None`, 仅用于占位|
|`return_value`|`Any`|已经获取到的参数值; 如果 Decorator 的类属性 `pre` 为 `True`, 则该值为 `None`, 也就是不会获取.|
|`dispatcher_interface`|`DispatcherInterface`|当前参数解析器接口的实例|
|`local_storage`|`Dict[Any, Any]`|状态存储, 可以用于在不同参数的修饰器间的信息交换, 在执行结束后仍保留, 与整个应用共用一个生命周期|

在这些接口中, `dispatcher_interface` 仍是你最强大的武器, 请妥善使用.