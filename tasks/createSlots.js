"use strict";
const dayjs = require("dayjs");
const db = require("../api/services/db.service.js");

seedSlotRecordsIntoDb();

async function seedSlotRecordsIntoDb() {
  let days = 7;
  let minutesInterval = 30;
  let slots = await generateSlots(days, minutesInterval);

  return await db.Slot.bulkCreate(slots);
}

async function generateSlots(days, minutesInterval) {
  let dateFormat = "YYYY-MM-DD HH:mm:ss";
  let minutesInWeek = 60 * 24 * days;
  let slotsCount = minutesInWeek / minutesInterval;
  let startOfDay = dayjs().startOf("day");
  let slots = [];

  for (let i = 0; i < slotsCount; i++) {
    let start = startOfDay.add(i * minutesInterval, "minute");
    let finish = start.add(minutesInterval - 1, "minute");
    let slot = {
      start: start.format(dateFormat),
      finish: finish.format(dateFormat),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Check if slot already exists in db to prevent duplicates:
    const slotExists = await db.Slot.findOne({ where: { start: slot.start } });
    if (slotExists) {
      console.log("Slot already exists in db, skipping: ", slot.start);
    } else {
      slots.push(slot);
    }
  }

  return slots;
}
