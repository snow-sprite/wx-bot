const superagent = require('superagent')
/**
 * http方法
 * @param method 请求方法
 * @param url 请求地址
 * @param params 请求参数
 * @param data 请求body
 * @param cookie cookie
 * @param spider 是否是爬取数据
 * @param platform 平台选择 默认: tx 天行数据
 */
function http({ method, url, params, data, cookie, spider=false, platform='tx'}) {
  return new Promise((resolve, reject) => {
    superagent(method, url)
      .query(params)
      .send(data)
      .set('Content-Type', 'applicaiton/x-www-form-urlencoded')
      .end((err, res) => {
        if (err) reject(err)
        // 抓取的每日一句
        if (spider) {
          resolve(res.text)
        } else {
          // 天行api相关
          if (platform == 'tx' && res.status === 200) resolve(JSON.parse(res.text))
          // 其他
          // TODO
        }
      })
  })
}

module.exports = {
  http
}