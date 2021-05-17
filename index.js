const { Wechaty, Friendship } = require('wechaty')
const qrTerm = require('qrcode-terminal')
const { initDailySentence } = require('./superAgent')
const { delay } = require('./utils')

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
    console.log(`启动每日任务————————————>`);
    // 定时任务： 每日一句
    const ONE = await initDailySentence()
    console.log('one+++++++++++++', ONE);
  }