module.exports = {
  dailySentenseUrl: `http://wufazhuce.com/`, // 每日一句网页版
  txWeatherUrl: `http://api.tianapi.com/txapi/tianqi/index`, // 天气api
  txNewsTopicUrl: `http://api.tianapi.com/txapi/wxhottopic/index`, // 微信热点话题
  txBotUrl: `http://api.tianapi.com/txapi/robot/index`, // 微信机器人聊天
  txKey: `56a40a56de8a035897ba2e58bdbfa315`, // 你自己申请的天行api key填到这里！！！！！
  city: `北京`, // 获取【天气】的所在城市
  autoReply: true, // 是否开启机器人的自动回复

  // 每日消息转发相关
  topics: ['测试群1', '测试群2'], // 待转发群名列表
  friends: [
    { alias: 'Cid', name: 'Cid' },
  ], // 待转发好友列表, alias:备注，name:昵称
  /**
   * 定时转发时间
   * 示例事件为每日早7点
   * 规则：
    *    *    *    *    *    *
    ┬    ┬    ┬    ┬    ┬    ┬
    │    │    │    │    │    │
    │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
    │    │    │    │    └───── month (1 - 12)
    │    │    │    └────────── day of month (1 - 31)
    │    │    └─────────────── hour (0 - 23)
    │    └──────────────────── minute (0 - 59)
    └───────────────────────── second (0 - 59, OPTIONAL)
  */
  timing: '0 0 7 * * *',
}