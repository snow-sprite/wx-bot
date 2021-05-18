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
    console.log(`每日一句 ——>>`, error);
    return error
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
    console.log(`天气出错 ——>>`, error);
  }
}

module.exports = {
  initDailySentence,
  initWeather
}