---
id: bcc-design-dispatcher
title: 参数解析器(Dispatcher)及其接口
sidebar-title: 参数解析器(Dispatcher)
---

:::note
为了后续叙述的方便, 我们先在这里约定好某些术语的中文翻译, 我们认为这些翻译非常准确, 但也请各位见仁见智.
 - `dispatch`: vt & vi. 解析(参数);
 - `dispatcher`: n. 参数解析器;
 - `Dispatcher Interface`: 参数解析器接口, 缩写为 `DiI` 或 `dii`.
:::

我们在前面已经叙述过了我们创造 `Broadcast Control` 的动机,
而我们将在这一章中说明在 `Broadcast Control` 中执行事件监听器的流程, 具体细节, 以及它的至今为止和从今往后.

## 至今为止的故事

在很久之前, 有一库, 名曰 `python-mirai`. 这个库实际就是 `Graia Framework` 的前身,
并且其事件监听的语法和现在的 `Graia Framework` 非常像, 内部处理也是通过对函数形式参数的定义进行解析,
以使语法尽可能简洁...?

哦上帝, 这孩子解析参数的实现方式居然只是通过一个字典,
并且是内联的, 与事件的定义强耦合, 使得每增加一个注解解释就极其可能崩掉整个应用,
开发成本随复杂度直线上升...

在经过几个月的沉思与停更, 我们设计出了 `Broadcast Control`.

## 现今

我们设计出了 `Dispatcher` 和 `DispatcherInterface`.

:::note
我们之所以一次提到两个事物, 是因为这两样之间的联系实在是太紧密, 源自于如果分开讲,
内容可能连我们都会不知所云...这可不好.
:::

我们主要在 `Broadcast.Executor` 这个方法处完成了对函数调用, 或者说, 对 `Callable` 对象的 `Call` 操作的高层封装.  
执行 `Broadcast.Executor` 一次的操作就叫做 "执行"(`Execute`), 这个方法也就根据字面意思译作 "执行器".  

到现在为止还挺好理解, 不是么?

### 处理 Dispatcher 集合/列表

在定义事件时, 我们会要求事件内定义一个 `Dispatcher` 的类, 并且继承自 `BaseDispatcher`.
这个类用于定义事件本身的 `Dispatcher`.

我们在设计 `Dispatcher` 时, 引入了 "混入"(`mixin`) 的设计:
假设我们有一个叫做 `TestDispatcher_1` 的 `Dispatcher`:

```python
class TestDispatcher_1(BaseDispatcher):
    ...
```

并且有 `TestDispatcher_2`, `TestDispatcher_3`, 内容暂时不用关心,
我们只要知道:

```python
TestDispatcher_3.mixin = []
TestDispatcher_2.mixin = [TestDispatcher_3]
TestDispatcher_1.mixin = [TestDispatcher_2]
```

那么, 我们对于 `mixin` 的处理函数 `dispatcher_mixin_handler` 的行为是这样的:

```python
dispatcher_mixin_handler(TestDispatcher_3) # [TestDispatcher_3]
dispatcher_mixin_handler(TestDispatcher_2) # [TestDispatcher_2, TestDispatcher_3]
dispatcher_mixin_handler(TestDispatcher_1) # [TestDispatcher_1, TestDispatcher_2, TestDispatcher_3]
```

:::note 顺带一提...
如果混入链中包含有重复的项, 也不会对其进行去重处理.
:::

然后我们会对上一步得出的结果进行进一步的处理, 这个过程我们暂时称为 "预注入".
这个处理流程其实就是将"环境"中的 `Dispatcher` 给加进去, 这里的 "环境" 包含以下引用:
 - 如果执行时, 传入的 `target` 类型为 `Listener`, `Listener.inline_dispatchers` 和 `Listener.namespace.injected_dispatchers` 会被**依次**插入到之前结果的头部.
 - 如果执行时, 传入了 `dispatcher` 参数且参数值合法, 也会在上一项操作执行后被插入.

总结下来, "预注入" 的优先级是这样, 最上面的是最先被注入的, 这意味着最下面的拥有最高处理优先级:

 - `Listener.inline_dispatchers`
 - `Listener.namespace.injected_dispatchers`
 - 传入的参数 `dispatcher`

用代码简单的表示:

```python
result_dispatcher = [
    *dispatcher,
    *Listener.namespace.injected_dispatchers,
    *Listener.inline_dispatchers,
    *dispatcher_mixin_handler(event)
]
```

哦, 我们还没有提到过, 真正可以用的 `Dispatcher` 的类型注解:

```python
T_Dispatcher = Union[
    BaseDispatcher, Type[BaseDispatcher],
    Callable[[DispatcherInterface], Any]
]
```

这意味着 `dispatcher` 可以用来称呼:
 - 一个继承了 `BaseDispatcher` 的类;
 - 一个继承了 `BaseDispatcher` 的类的实例;
 - 一个接受一个类型为 `DispatcherInterface` 的任意 `Callable`.

:::note
值得注意的是...我们**并没有**在实际的代码中实装这一类型注解, 这里仅仅只是拿来辅助说明而已.
:::

### 接触 Dispatcher Interface

`DispatcherInterface`, 即 "参数解析器接口", 在 `Broadcast Control` 中负责从一个既定的 `Dispatcher` 集合中获取与当前上下文相匹配的值.
这个值则由 `Dispatcher` 的方法 `catch` 或者它本身返回, 后者仅在当目标 `Dispatcher` 为一 `Callable` 时发生.

那么, "上下文"(`Context`) 从何而来?

:::warning
这里的上下文与 `Graia Application for Mirai` 中所包含的模块 `graia.application.context` 无关.
:::

我们使用 Python 标准库 `inspect` 扫描所给出函数的参数定义, 主要获取以下几个信息:
 - `name`, 即参数的名称;
 - `annotation`, 与参数名称相对应的类型注解(`Type Annotation`);
 - `default`, 参数的默认值.

于是我们使用 Python 的 `with statement` 特性, 调用了 `DispatcherInterface.enter_context` 方法;

:::note
如果你对 `DispatcherInterface` 实例的位置感兴趣...它现在随 `Broadcast` 对象共享同一个生命周期,
你可以通过获取 `Broadcast.dispatcher_interface` 获取它.
:::

这个方法向 `DispatcherInterface` 内部维护的上下文栈推送一个 "执行上下文",
该上下文环境包括两个东西:

 - 当前正在处理的事件实例;
 - 之前处理得到的 `Dispatcher` 集合.

之后的一切才真正开始.

### 窥探 Dispatcher Interface

我们在上一节中讲到, 我们使用 `inspect` 解析函数的参数定义,
实际代码中完成这项工作的是 `argument_signature` 函数, 它返回一个 `Tuple[str, Any, Any]`,
正好与 `name, annotation, default` 的顺序相符合.

之后, 我们使用了 `DispatcherInterface.execute_with` 方法.

:::note
在这里我们贴上 `DispatcherInterface.execute_with` 的定义:

```python
async def execute_with(name: str, annotation: Any, default: Any) -> Any:
    pass
```

看起来蛮奇怪的, 不是么?
:::

事实上, 这是真的.

`DispatcherInterface.execute_with` 负责与 `Dispatcher` 集合中的 `Dispatcher` 交互,
`Broadcast.Executor` 则将该方法的返回值作为参数传入. 返回值的类型注解是 `Any`,
因为我们无法推断 `Dispatcher` 的返回值的类型, 毕竟它甚至能抛出异常(`RequirementCrashed`).

那么, `DispatcherInterface.execute_with` 又是如何与 `Dispatcher` 交互的?

当 `DispatcherInterface.execute_with` 执行时, 它会先向内部的 "参数解析上下文栈" 推送新的上下文实例,
这个上下文实例包含了方法被执行时传入的所有参数和一些其他的东西.

:::note
如果你对这个上下文实例感兴趣...它叫 `ExecuteContextStackItem`,
在 `graia.broadcast.interfaces.dispatcher` 处被定义,
与 `DispatcherInterface` 的定义在一个模块下面.

别被文字误导了, 这只是个笔误, 我们仍然用 "参数解析上下文" 称呼它.
:::

:::tip
你可能会迷惑: 这么多的 "上下文", 设计出来做什么?

你会知道这个设计所带来的惊人的可扩展性的, 不过...我们在这里只讲它的工作流程,
可能性则由你们去发掘了.
:::

上下文推进去了, 接下来是一系列迷离的东西, 我们会分开来讲述的, 这里我们先将这些内容分为几大块:

 - 普通的参数解析流程;
 - `alive_generator_dispatcher` 相关;
 - `always dispatcher` 相关.

TODO: ANYTHING.