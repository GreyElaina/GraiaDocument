---
id: about-config
title: 配置参数
sidebar_label: 配置参数
---

注意以下代码中被高亮所圈出的部分

```python
from graia.broadcast import Broadcast
from graia.application import GraiaMiraiApplication, Session
from graia.application.message.chain import MessageChain
import asyncio

from graia.application.message.elements.internal import Plain
from graia.application.friend import Friend

loop = asyncio.get_event_loop()

# highlight-start
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
# highlight-end

@bcc.receiver("FriendMessage")
async def friend_message_listener(app: GraiaMiraiApplication, friend: Friend):
    await app.sendFriendMessage(friend, MessageChain.create([
        Plain("Hello, World!")
    ]))

app.launch_blocking()
```

在所圈出的部分中, 是我们在上一节中所配置的, 用于使我们的应用与 `mirai-api-http` 通讯的配置.
这节相当于一个 `API Referrer`, 这之后会出现更多这种类型的文档的.

在这段配置中, 我们实例化了一个 `Session` 实例. 不要害怕, 这玩意并没有那么玄乎:
它仅仅只是一个 `Type[BaseModel]`, 我们把这玩意拿来存状态用, 和 web 开发中的 `Session` 很像,
但也只是功能上很像: 都是拿来存状态用的.

浏览其定义, 你发现你可以使用这些字段作为参数传入:

|参数/属性名称|类型|必选|描述|
|:-:|:-:|:-:|:-|
|`host`|`str`|√|`mirai-api-http` 服务地址|
|`authKey`|`str`|√|在 `mirai-api-http` 配置流程中定义, 需为相同的值以通过安全验证.|
|`account`|`int`|√|应用所使用账号, 需为一个整数(int), 且需在 `mirai-console` 处先登录后才可用|
|`websocket`|`bool`|×|是否使用 Websocket 方式获取事件, 若为 `False` 则使用 HTTP 短轮询方式获取事件, 性能较低. 默认值为 `True`|

在应用启动后(即执行 `app.launch_blocking` 后), 在可以访问以上属性的同时, 你还可以获取以下属性, 但不建议更改:

|属性名称|类型|描述|
|:-:|:-:|:-|
|`sessionKey`|`str`|会话标识, 即会话中用于进行操作的唯一认证凭证, 需要执行方法 `GraiaMiraiApplication.activeSession` 后才可用(该方法会自动执行).|