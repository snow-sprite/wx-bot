const { Wechaty, Friendship } = require('wechaty')
const qrTerm = require('qrcode-terminal')
const {
  initDailySentence,
  initWeather
} = require('./api')
const {
  delay,
  transfer
} = require('./utils')

const bot = new Wechaty({
  name: 'wx-bot',
  puppet: 'wechaty-puppet-wechat',
})

bot
  .on('scan', onScan)
  .on('login', onLogin)
  .on('friendship', onFriendShip)
  .on('message', onMessage)
  .on('logout', onLogout)

bot
  .start()
  .then(() => console.log(`请先扫码登录`))
  .catch(err => {
      console.log(`
        啊哦，出错了:(, 
        ${err}
        `
    )
    bot.stop()
    }
)

  function onScan(qrcode, status) {
    qrTerm.generate(qrcode, { small: true })
  }
  async function onLogin(user) {
    console.log(`${user}已上线`)

    // 每日任务
    await initDailyTask()
  }
  async function onFriendShip(friendship) {
    let logMsg
    const fileHelper = bot.Contact.load('filehelper')
    
    try {
      logMsg = `收到“${friendship.contact().name()}”的好友请求：“${friendship.hello()}”`
      
      switch (friendship.type()) {
        // 1. 新的好友请求
        case Friendship.Type.Receive:
          await delay(2000)
          await friendship.accept()
          break;
        // 2. 好友确认
        case Friendship.Type.Confirm:
          await delay(2000)
          logMsg = `“${friendship.contact().name()}”的好友请求已通过！`
          break;
      }
    } catch (error) {
      logMsg = error.message
    }

    console.log('logMsg---------------------', logMsg);
    await fileHelper.say(logMsg)
  }
  async function onMessage(msg) {
    // TODO
  }
  function onLogout(user) {
    console.log(`${user}已下线`)
  }

  // 每日定时任务
  async function initDailyTask() {
    const fileHelper = bot.Contact.load('filehelper')
    console.log(`启动每日任务 ——>>`);
    // 定时任务： 每日一句
    const ONE = await initDailySentence()
    console.log('no.1 每日一句:', ONE);
    await fileHelper.say(ONE)

    // 定时任务： 每日天气
    const WEATHER = await initWeather()
    const today = WEATHER['newslist'][0]
    const UVText = transfer(today.uv_index)
    let weatherMsg = 
      `${today.date} ${today.week} ${today.area}天气情况：
      ${today.weather}
      气温：${today.lowest}~${today.highest}
      实时气温：${today.real}
      ${today.wind} ${today.windsc}
      相对湿度：${today.humidity}%rh
      紫外线强度：${UVText}
      温馨提示：${today.tips}`
    console.log(`no.2 每日天气:`, weatherMsg);
    await fileHelper.say(weatherMsg)
  }