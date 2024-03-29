const { WechatyBuilder } = require('wechaty')
const qrTerm = require('qrcode-terminal')
const { machineIdSync } = require('node-machine-id')
const md5 = require('md5')
const {
  initDailySentence,
  initWeather,
  initWXTopic,
  initTXBot } = require('./api')
const config = require('./config')
const {
  sleep,
  transfer } = require('./utils')
const schedule = require('./utils/schedule')

const UNIQUE_ID = md5(machineIdSync())
let LOGIN_NAME = ''
// 待转发的群
var forwardRooms = []
// 待转发的好友
var forwardFriends = []
// 【群】转发锁
let isRoomBlock = false
// 【好友】转发锁
let isFriendBlock = false

function onScan(qrcode, status) {
  qrTerm.generate(qrcode, { small: true });
  const qrcodeImageUrl = [
    'https://wechaty.js.org/qrcode/',
    encodeURIComponent(qrcode),
  ].join('');
  console.log(qrcodeImageUrl);
}
async function onLogin(user) {
  console.log(`${user}已上线`)
  LOGIN_NAME = user.name()
  // 待转发内容的【群】，由于是异步事件，这里先提前获取
  config.topics.forEach(async topic => {
    let tempRoom = await bot.Room.find({ topic })
    forwardRooms.push(tempRoom)
  })
  // TODO .find方法无法获取到有效好友，暂时先注释了
  // 待转发内容的【好友】，由于是异步事件，这里先提前获取
  // if (!config.isForwadAll) {
  //   config.friends.forEach(async ({ alias, name }) => {
  //     // https://github.com/wechaty/wechaty/issues/1689
  //     await sleep(15000)
  //     const tempFriend = (await bot.Contact.find({ alias }))
  //       || (await bot.Contact.find({ name }))
  //     forwardFriends.push(tempFriend)
  //   })
  // }
  
  // 每日任务
  console.log(`每日任务已启动>>------>>`);
  schedule.setSchedule(config.timing, initDailyTask)
}
async function onReady() {
  if (config.isForwadAll) {
    // https://github.com/wechaty/wechaty/issues/1594
    // 群发
    let contactList = await bot.Contact.findAll()
    // 过滤掉【公众号】
    contactList = contactList.filter(friend => friend.payload.type !== 2)
    contactList.forEach(async (friend) => {
      // https://github.com/wechaty/wechaty/issues/1689
      await sleep(2000)
      forwardFriends.push(friend)
    })
  }
}
async function onFriendShip(friendship) {
  let logMsg
  const fileHelper = bot.Contact.load('filehelper')
  
  try {
    logMsg = `收到“${friendship.contact().name()}”的好友请求：“${friendship.hello()}”`
    
    switch (friendship.type()) {
      // 1. 新的好友请求
      case bot.Friendship.Type.Receive:
        await sleep(2000)
        await friendship.accept()
        break;
      // 2. 好友确认
      case bot.Friendship.Type.Confirm:
        await sleep(2000)
        logMsg = `“${friendship.contact().name()}”的好友请求已通过！`
        break;
    }
  } catch (error) {
    logMsg = error.message
  }

  await fileHelper.say(logMsg)
}
async function onMessage(msg) {
  const contact = msg.talker() // 聊天者
  const text = msg.text() // 聊天内容
  const room = msg.room() // 群消息
  /**
   * MessageType.Unknown
   * MessageType.Attachment
   * MessageType.Audio
   * MessageType.Contact
   * MessageType.Emoticon
   * MessageType.Image
   * MessageType.Text
   * MessageType.Video
   * MessageType.Url
   */
  const type = msg.type()

  // 每日任务从fileHelper转发到群消息
  if (text.includes(`=======================`)) {
    if (forwardRooms && forwardRooms.length > 0 && !isRoomBlock) {
      forwardRooms.forEach(room => {
        msg.forward(room)
        isRoomBlock = true
      })
    }
    if (forwardFriends && forwardFriends.length > 0 && !isFriendBlock) {
      forwardFriends.forEach(friend => {
        msg.forward(friend)
        isFriendBlock = true
      })
    }
  }
  if (msg.self()) return

  // 处理群消息
  if (room) {
    try {
      /**
       * 解决wechaty群里@我 一直返回false的bug
       * 相关ISSUSE：https://github.com/wechaty/wechaty/issues/2149
       */
      const isMentionSelf = await msg.mentionSelf() // 是否@我了
      // 只处理@我的内容
      if (isMentionSelf || text.includes(`@${LOGIN_NAME}`)) {
        if (config.autoReply) {
          // 处理消息内容为text的
          if (type === bot.Message.Type.Text) {
            // 处理一下消息的body，去掉@user相关内容
            let replyText = ''
            let reg = new RegExp(`@${LOGIN_NAME}`, 'ig')
            replyText = text.replace(reg, '').trim()
            await sleep(2000)
            let data = await initTXBot(UNIQUE_ID, replyText, 0)
            let reply = data['newslist'][0].reply
            // 私聊
            // contact.say(reply)
            // 群聊
            msg.say(reply)
          }
        }
      }
    } catch (error) {
      console.log('message-error', error);
    }
  }
}
function onLogout(user) {
  console.log(`${user}已下线`)
}

// 每日定时任务
async function initDailyTask() {
  // 关闭多个【群】发转发锁
  isRoomBlock = false
  // 关闭多个【好友】转发锁
  isFriendBlock = false
  const fileHelper = bot.Contact.load('filehelper')
  // 定时任务1： 每日一句
  let SENTENCE = ''
  try {
    SENTENCE = await initDailySentence()
    console.log(`【定时任务1： 每日一句】成功！`);
  } catch (error) {
    console.log(`【每日一句】获取失败`, error);
  }
  
  // 定时任务2： 每日天气
  let WEATHERINFO = ''
  try {
    const WEATHER = await initWeather()
    if (WEATHER.code !== 200 && WEATHER.msg !== 'success') {
      WEATHERINFO = `error with code${WEATHER.code} ${WEATHER.msg}`
    } else {
      const today = WEATHER['newslist'][0]
      const UVText = transfer(today.uv_index)
      WEATHERINFO = 
        `${today.date} ${today.week} 📍【${today.area}】
        ${today.weather}
        气温：${today.lowest}~${today.highest}
        实时气温：${today.real}
        ${today.wind} ${today.windsc}
        相对湿度：${today.humidity}%rh
        紫外线强度：${UVText}
        温馨提示：${today.tips}
        `
      console.log(`【定时任务2： 每日天气】成功！`);
    }
  } catch (error) {
    console.log(`【每日天气】获取失败：${error.message}`);
  }
  
  // 定时任务3： 微信热点话题
  let NEWS = ''
  try {
    const TODAY_NEWS = await initWXTopic()
    if (TODAY_NEWS.code !== 200 && TODAY_NEWS.msg !== 'success') {
      NEWS = `error with code${TODAY_NEWS.code} ${TODAY_NEWS.msg}`
    } else {
      TODAY_NEWS.newslist.some((n, i) => {
        NEWS += `${i + 1}. ${n.word}\n\t`
      })
    }
    
    console.log(`【定时任务3： 微信热点话题】成功！`);
  } catch (error) {
    console.log(`【微信热点话题】获取失败`, error);
  }
  // 【每日一句】🌈🌈🌈${SENTENCE}🦄🦄🦄
  const message =
  `
  =======================
  【每日一句🦄】${SENTENCE}

  【今日天气🌈】${WEATHERINFO}
  【热点话题💭】
  ${NEWS}
  =======================
  `
  fileHelper.say(`${message}`)
}
  
const bot = WechatyBuilder.build({
  name: 'wx-bot',
  puppet: 'wechaty-puppet-wechat',
  puppetOptions: {
    // endpoint: '<executablePath>',
    uos: true
  }
})

bot
  .on('scan', onScan)
  .on('login', onLogin)
  .on('ready', onReady)
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
