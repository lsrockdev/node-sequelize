'use strict';
const dayjs = require('dayjs')

function generateSlots(days, minutesInterval) {
  let dateFormat = 'YYYY-MM-DD hh:mm:ss'
  let minutesInWeek = 60 * 24 * days
  let slotsCount = minutesInWeek / minutesInterval
  let startOfDay = dayjs().startOf('day')
  let slots = []

  for (let i = 0; i < slotsCount; i++) {
    let start = startOfDay.add(i * minutesInterval, 'minute')
    let finish = start.add(minutesInterval - 1, 'minute')
    let slot = {
      start: start.format(dateFormat),
      finish: finish.format(dateFormat),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    slots.push(slot)
  }

  return slots
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    let days = 7
    let minutesInterval = 30
    let slots = generateSlots(days, minutesInterval)
    return queryInterface.bulkInsert('Slots', slots, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Slots', null, {});
  }
};
