const schedule = require('node-schedule')

function setSchedule(timing, callback) {
  schedule.scheduleJob(timing, callback)
}

module.exports = {
  setSchedule
}