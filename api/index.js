const { http } = require('../utils/http')
const config = require('../config')
const cheerio = require('cheerio')
/**
 * 每日一句
 * http://wufazhuce.com/
 */
const initDailySentence = async () => {
  const data = await http({
    method: 'get',
    url: config.dailySentenseUrl,
    spider: true
  })
  const $ = cheerio.load(data)
  let daliayBox =
    $('#carousel-one .carousel-inner .item')
  let daliayData =
    $(daliayBox[0])
      .find('.fp-one-cita')
      .text()
      .replace(/(^\s*)|(\s*$)/g, '');
  return daliayData
}

/**
 * 天气接口
 */
const initWeather = async () => {
  const data = await http({
    method: 'get',
    url: config.txWeatherUrl,
    params: { key: config.txKey, city: config.city },
    spider: false
  })
  return data
}

/**
 * 微信热点话题top10
 */
const initWXTopic = async () => {
  const data = await http({
    method: 'get',
    url: config.txNewsTopicUrl,
    params: { key: config.txKey }
  })
  return data
}

/**
 * 天行机器人聊天
 */
const initTXBot = async (uniqueid, question, restype) => {
  const replay = await http({
    method: 'get',
    url: config.txBotUrl,
    params: {
      key: config.txKey,
      mode: 0, // 工作模式，宽松模式0（回答率高）、精确模式1（相关性高）、私有模式2（只从私有词库中回答）
      priv: 2, // 私有词库匹配模式，完整匹配0[默认]、智能匹配1，模糊匹配2，结尾匹配3，开头匹配4
      question,
      uniqueid,
      restype // 输入类型，文本0、语音1、人脸图片2
    }
  })
  return replay
}

module.exports = {
  initDailySentence,
  initWeather,
  initWXTopic,
  initTXBot
}