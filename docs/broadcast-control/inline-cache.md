---
id: bcc-inline-cache
title: 内联缓存(Inline Cache)
sidebar-title: 内联缓存(Inline Cache)
---

为了提供更好的性能, 我们提供了内联缓存特性, 通过缓存能够给出结果的 `Dispatcher`,
跳过漫长的寻找直接指向其得出结果.

:::note
本特性优化程度因实际使用情况而异, 其中特别是当使用 `Decorator` 特性时, 本特性的优化程度将会很低...  
本特性仍然不稳定, 但已经经过测试, 可以考虑使用
:::

## 如何启用

本特性只需要在实例化 `Broadcast` 时传入两个参数, 即可全局启用.

``` python
bcc = Broadcast(
    ...,
    use_dispatcher_statistics = True,
    use_reference_optimization = True
)
```