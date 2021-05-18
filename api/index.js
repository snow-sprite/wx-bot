const { http } = require('../utils/http')
const config = require('../config')
const cheerio = require('cheerio')
/**
 * 每日一句
 * http://wufazhuce.com/
 */
const initDailySentence = async () => {
  try {
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
  } catch (error) {
    let errMsg = `【每日一句】出错——>> ${error}`
    console.log(errMsg);
  }
}

/**
 * 天气接口
 */
const initWeather = async () => {
  try {
    const data = await http({
      method: 'get',
      url: config.txWeatherUrl,
      params: { key: config.txKey, city: config.city },
      spider: false
    })
    return data
  } catch (error) {
    let errMsg = `【天气】出错——>> ${error}`
    console.log(errMsg);
  }
}

/**
 * 微信热点话题top10
 */
const initWXTopic = async () => {
  try {
    const data = await http({
      method: 'get',
      url: config.txNewsTopic,
      params: { key: config.txKey }
    })
    return data
  } catch (error) {
    let errMsg = `【微信热点话题】出错——>> ${error}`
    console.log(errMsg);
  }
}

module.exports = {
  initDailySentence,
  initWeather,
  initWXTopic
}