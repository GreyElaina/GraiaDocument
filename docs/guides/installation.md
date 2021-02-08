---
id: installation
title: 安装并配置开发环境
sidebar_label: 安装并配置开发环境
---

## 前言

这里我们假设你已经参照 [ `mirai` ](https://github.com/mamoe/mirai) 和 [ `mirai-api-http` ](https://github.com/mamoe/mirai-api-http)
的 README, 通过类似 `mirai-console-wrapper` / `miraiOK` / `miraiN` / `mirua` 的方式启动了你的 `mirai-console` , 同时也安装了最新版本的 `mirai-api-http` 插件.  

:::important 重要

如果你使用时开发库出现了错误, 应先检查是否是 `Graia Framework` 的错误, 
确认之后, 请在我们的 [GitHub Issues](https://github.com/GraiaProject/Application/issues) 处汇报你的错误, 
我们会尽快处理问题

:::

## 安装

``` bash
pip install graia-application-mirai
# 使用 poetry(推荐的方式)
poetry add graia-application-mirai
```

这同时会安装 `graia-application-mirai` 和 `graia-broadcast` 这两个包的最新版本.

:::note 提示
如果你想更新其中的一个:

``` bash
# 更新 graia-application-mirai
pip install graia-application-mirai --upgrade
## 使用 poetry
poetry update graia-application-mirai

# 更新 graia-broadcast
pip install graia-broadcast --upgrade
## 使用 poetry
poetry update graia-broadcast
```
:::

## 历史性的第一次对话

现在我们需要协定好 `mirai-api-http` 的配置, 以便于接下来的说明.

根据 `mirai-api-http` 的相关文档, 我们可以得出这么一个配置文件的方案:

``` yaml
# file: mirai-client/config/MiraiAPIHTTP/net.mamoe.mirai.api.http.config.Setting
authKey: graia-mirai-api-http-authkey # 你可以自己设定, 这里作为示范

# 可选，缓存大小，默认4096.缓存过小会导致引用回复与撤回消息失败
cacheSize: 4096

enableWebsocket: true # 是否启用 websocket 方式, 若使用 websocket 方式交互会得到更好的性能
host: '0.0.0.0' # httpapi 服务监听的地址, 错误的设置会造成 Graia Application 无法与其交互
port: 8080 # httpapi 服务监听的端口, 错误的设置会造成 Graia Application 无法与其交互
```

将以下代码保存到文件 `bot.py` 内, 确保该文件位于你的工作区内:

``` python
from graia.broadcast import Broadcast
from graia.application import GraiaMiraiApplication, Session
from graia.application.message.chain import MessageChain
import asyncio

from graia.application.message.elements.internal import Plain
from graia.application.friend import Friend

loop = asyncio.get_event_loop()

bcc = Broadcast(loop=loop)
app = GraiaMiraiApplication(
    broadcast=bcc,
    connect_info=Session(
        host="http://localhost:8080", # 填入 httpapi 服务运行的地址
        authKey="graia-mirai-api-http-authkey", # 填入 authKey
        account=5234120587, # 你的机器人的 qq 号
        websocket=True # Graia 已经可以根据所配置的消息接收的方式来保证消息接收部分的正常运作.
    )
)

@bcc.receiver("FriendMessage")
async def friend_message_listener(app: GraiaMiraiApplication, friend: Friend):
    await app.sendFriendMessage(friend, MessageChain.create([
        Plain("Hello, World!")
    ]))

app.launch_blocking()
```

:::note 提示

如果你对 v3 中的 url 表示整个连接信息的方式念念不忘...我们也提供了相应的解决方案, 尽管这种方式不再推荐:
``` python
Session.fromUrl("mirai://localhost:8080/ws?authKey=graia-mirai-api-http-authkey&qq=5234120587")
```

:::

运行代码, 终端输出:

``` bash
[root@localhost] $ python bot.py
[2020-07-25 21:42:11,929][INFO]: launching app...
[2020-07-25 21:42:11,960][INFO]: using websocket to receive event
[2020-07-25 21:42:11,964][INFO]: event reveiver running...
```

然后和机器人账号发起好友对话, 当你的机器人向你发出 `Hello, World!` 时,
你就已经部署好了一个最小的 `Graia Framework` 应用, 在接下来的文档中, 我们将开始介绍我们提供的各种 API 和特性.

> "下一章!" 苏菲如此说道.