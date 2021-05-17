const { http } = require('../utils/http')
const config = require('../config')
const cheerio = require('cheerio')
/**
 * 每日一句
 * http://wufazhuce.com/
 */
const initDailySentence = async () => {
  try {
    const data = http({ method: 'get', url: config.dailySentenseUrl, spider: true })
    const $ = cheerio.load(data)
    let daliayBox =
      $('#carousel-one .carousel-inner .item')
    let daliayData =
      $(daliayBox[0])
        .find('.fp-one-cita')
        .text()
        .replace(/(^\s*)|(\s*$)/g, '');
    console.log('daliayData', daliayData);
    return daliayData
  } catch (error) {
    console.log(`每日一句出错------>`, error);
    return error
  }
}

module.exports = {
  initDailySentence
}