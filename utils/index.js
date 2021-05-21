// 延时执行
const sleep = ms => new Promise(resolve => setTimeout(resolve(), ms))

// 根据输入数值输出对应数值（0~10）‘强’ ‘中’ ‘弱’
const transfer = number => {
  if (number <= 3) {
    return '弱'
  } else if (number > 3 && number < 7) {
    return '中'
  } else {
    return '强'
  }
}

module.exports = {
  sleep,
  transfer
}