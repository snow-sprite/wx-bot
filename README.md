### wechaty 微信交互

定时发送内容到【文件传输助手】，然后再转发到【个人】或者【群消息】

#### 重要提示

`web`版容易被限制登录，需要下载`wechaty-puppet-wechat`，解决思路是`UOS`下的微信只是网页版嵌套了一个`electron`，所以呢有大神就对比了一下请求头，发现了只要在请求的地址上首先加一个`?target=t`就是这样`https://wx.qq.com/?target=t`，然后在扫码登陆后拦截 `https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxnewloginpage` 这个请求，并在请求头上添加两个固定的参数:

```
extspam ='Gp8ICJkIEpkICggwMDAwMDAwMRAGGoAI1GiJSIpeO1RZTq9QBKsRbPJdi84ropi16EYI10WB6g74sGmRwSNXjPQnYUKYotKkvLGpshucCaeWZMOylnc6o2AgDX9grhQQx7fm2DJRTyuNhUlwmEoWhjoG3F0ySAWUsEbH3bJMsEBwoB//0qmFJob74ffdaslqL+IrSy7LJ76/G5TkvNC+J0VQkpH1u3iJJs0uUYyLDzdBIQ6Ogd8LDQ3VKnJLm4g/uDLe+G7zzzkOPzCjXL+70naaQ9medzqmh+/SmaQ6uFWLDQLcRln++wBwoEibNpG4uOJvqXy+ql50DjlNchSuqLmeadFoo9/mDT0q3G7o/80P15ostktjb7h9bfNc+nZVSnUEJXbCjTeqS5UYuxn+HTS5nZsPVxJA2O5GdKCYK4x8lTTKShRstqPfbQpplfllx2fwXcSljuYi3YipPyS3GCAqf5A7aYYwJ7AvGqUiR2SsVQ9Nbp8MGHET1GxhifC692APj6SJxZD3i1drSYZPMMsS9rKAJTGz2FEupohtpf2tgXm6c16nDk/cw+C7K7me5j5PLHv55DFCS84b06AytZPdkFZLj7FHOkcFGJXitHkX5cgww7vuf6F3p0yM/W73SoXTx6GX4G6Hg2rYx3O/9VU2Uq8lvURB4qIbD9XQpzmyiFMaytMnqxcZJcoXCtfkTJ6pI7a92JpRUvdSitg967VUDUAQnCXCM/m0snRkR9LtoXAO1FUGpwlp1EfIdCZFPKNnXMeqev0j9W9ZrkEs9ZWcUEexSj5z+dKYQBhIICviYUQHVqBTZSNy22PlUIeDeIs11j7q4t8rD8LPvzAKWVqXE+5lS1JPZkjg4y5hfX1Dod3t96clFfwsvDP6xBSe1NBcoKbkyGxYK0UvPGtKQEE0Se2zAymYDv41klYE9s+rxp8e94/H8XhrL9oGm8KWb2RmYnAE7ry9gd6e8ZuBRIsISlJAE/e8y8xFmP031S6Lnaet6YXPsFpuFsdQs535IjcFd75hh6DNMBYhSfjv456cvhsb99+fRw/KVZLC3yzNSCbLSyo9d9BI45Plma6V8akURQA/qsaAzU0VyTIqZJkPDTzhuCl92vD2AD/QOhx6iwRSVPAxcRFZcWjgc2wCKh+uCYkTVbNQpB9B90YlNmI3fWTuUOUjwOzQRxJZj11NsimjOJ50qQwTTFj6qQvQ1a/I+MkTx5UO+yNHl718JWcR3AXGmv/aa9rD1eNP8ioTGlOZwPgmr2sor2iBpKTOrB83QgZXP+xRYkb4zVC+LoAXEoIa1+zArywlgREer7DLePukkU6wHTkuSaF+ge5Of1bXuU4i938WJHj0t3D8uQxkJvoFi/EYN/7u2P1zGRLV4dHVUsZMGCCtnO6BBigFMAA='
client-version' = '2.0.0',
```

这样就不会受限制,可以完美使用桌面版协议了（2021-5-20 记录，以后会怎样说不准）。详见<https://wechaty.js.org/2021/04/13/wechaty-uos-web/>

#### 主要功能

1. 每日一句

- 使用 spider 爬取<http://wufazhuce.com/>的内容

2. 今日天气
3. 热点话题
4. 机器人聊天
   暂时只有这些功能，其他想要的功能可以到[天行](https://www.tianapi.com/login.html)或者其他开源项目去找下

#### 环境配置

> **`node >= v16.17.0`**
> 配置`npm`镜像源为淘宝镜像源（重要，因为需要安装 chromium），使用`npm`的话可能会很慢或者失败。

```
npm config set registry https://registry.npm.taobao.org
npm config set disturl https://npm.taobao.org/dist
npm config set puppeteer_download_host https://npm.taobao.org/mirrors
```

#### 项目配置

需要配置的主要文件是`config`下的`index.js`，注释已经写得很简洁明了了，根据注释来修改就行。

#### 使用

```
$ npm i
$ export WECHATY_PUPPET=wechaty-puppet-wechat // 关键，需要配置你使用的puppet
$ npm start
```

#### sh

> 项目运行可能会报`UnhandledPromiseRejectionWarning: Error: Page crashed!`，请多尝试几次。
> 如果项目跑不起来，可以删除`package-lock.josn`、`wx-bot.memory-card.json`、`node_modules`后重新运行`npm start`。

#### bug

- 经测试，发送群消息时，由于群不够活跃或者删除了群（未保存到通讯录）会导致群消息发送失败。（暂时解决办法：一个人随便在群里发一点内容就行了）

#### Donate

> 如果你觉得这个项目帮助到了你，你可以给作者买一杯~~咖啡~~ ~~奶茶~~果汁。

<span><img align="center" alt="WeChat" title="WeChat" src="https://raw.githubusercontent.com/snow-sprite/picGoPublic/master/github-imgs/wechat.png" width="300px" height="300px" /></span>
<span><img align="center" alt="Alipay" title="Alipay" src="https://raw.githubusercontent.com/snow-sprite/picGoPublic/master/github-imgs/alipay.png" width="300px" height="300px" /></span>
