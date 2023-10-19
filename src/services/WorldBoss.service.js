import CircularStack from "circular-stack";
import { DateTime, Duration } from "luxon";

const WorldBoss = {
  WD: Symbol("Wandering Death"),
  AV: Symbol("Avarice"),
  AS: Symbol("Ashava"),
}

class WorldBossService {
  constructor() {
    this.offset = Duration.fromISO('PT3H30M');
    // this.zero = DateTime.local(2023, 10, 5, 19, 20, 56, 0, { zone: 'UTC-4' });
    this.zero = DateTime.fromISO('2023-10-20T03:00:00.000-04:00');
    this.bosses = new CircularStack(38);
    this.pastOccurences = new CircularStack(1);
    this.futureOccurences = new CircularStack(1);
    this.occurrences = [];
  }


  isNotAllowedTimeInterval(dt) {
    var time = DateTime.local({ zone: 'UTC-4' }).set({ hour: dt.hour, minute: dt.minute, second: 0, millisecond: 0 });
    var firstStart = DateTime.local({ zone: 'UTC-4' }).set({ hour: 0, minute: 30, second: 0, millisecond: 0 });
    var firstEnd = DateTime.local({ zone: 'UTC-4' }).set({ hour: 2, minute: 30, second: 0, millisecond: 0 });
    var secondStart = DateTime.local({ zone: 'UTC-4' }).set({ hour: 6, minute: 30, second: 0, millisecond: 0 });
    var secondEnd = DateTime.local({ zone: 'UTC-4' }).set({ hour: 8, minute: 30, second: 0, millisecond: 0 });
    var thirdStart = DateTime.local({ zone: 'UTC-4' }).set({ hour: 12, minute: 30, second: 0, millisecond: 0 });
    var thirdEnd = DateTime.local({ zone: 'UTC-4' }).set({ hour: 14, minute: 30, second: 0, millisecond: 0 });
    var fourthStart = DateTime.local({ zone: 'UTC-4' }).set({ hour: 18, minute: 30, second: 0, millisecond: 0 });
    var fourthEnd = DateTime.local({ zone: 'UTC-4' }).set({ hour: 20, minute: 30, second: 0, millisecond: 0 });
    if (this.checkTimeInterval(time, firstStart, firstEnd) ||
      this.checkTimeInterval(time, secondStart, secondEnd)
      || this.checkTimeInterval(time, thirdStart, thirdEnd)
      || this.checkTimeInterval(time, fourthStart, fourthEnd)) {
      console.log("Hours: " + dt.toISO() + " time: " + time.toISO());
      return false;
    } else {
      console.log("Add 2 hours: " + dt.toISO() + " time: " + time.toISO());
      return true;
    }
  }


  checkTimeInterval(time, start, end) {
    if (start <= time && end >= time) {
      return true;
    } else {
      return false;
    }
  }

  calculateSingleSeasonOne(baseDT) {
    var currentBoss = this.bosses.pop();
    var currentDT = baseDT.plus(currentBoss.offset);
    var extra = false;
    if (this.isNotAllowedTimeInterval(currentDT)) {
      currentDT = currentDT.plus({ minute: 120 });
      extra = true;
    }
    var occurrence = { order: currentBoss.order, extraTime: extra, boss: currentBoss.boss, datetime: currentDT }
    this.refillBossStack();
    return occurrence;
  }

  calculateSingle(baseDT) {
    var currentBoss = this.bosses.pop();
    var currentDT = baseDT.plus(currentBoss.offset);
    var cacheReset = currentDT.weekdayLong === 'Thursday';
    var occurrence = { order: currentBoss.order, extraTime: cacheReset, boss: currentBoss.boss, datetime: currentDT };
    this.refillBossStack();
    return occurrence;
  }

  calculate(parameters) {
    let result = [];
    this.refillBossStack();
    var now = DateTime.local({ zone: 'UTC-4' });
    var last = now.plus({ day: parameters.days });
    var occurrence = this.calculateSingle(this.zero);
    if (occurrence.datetime >= now) {
      result.push(occurrence);
    }
    while (occurrence.datetime <= last) {
      occurrence = this.calculateSingle(occurrence.datetime);
      if (occurrence.datetime >= now) {
        result.push(occurrence);
      }
    }
    return result;
  }

  calculateSeasonOne(parameters) {
    let result = [];
    this.pastOccurences = new CircularStack(parameters.pastEventsSize + 1);
    this.futureOccurences = new CircularStack((parameters.days * 4) + 4);
    this.refillBossStack();
    var now = DateTime.local({ zone: 'UTC-4' });
    var finalDT = DateTime.local({ zone: 'UTC-4' }).plus({ day: parameters.days });
    console.log("Starting calculation from " + this.zero.toISO() + ", to " + finalDT.toISO());
    var occurrence = this.calculateSingleSeasonOne(this.zero);
    this.pastOccurences.push(occurrence);
    var currentDT = occurrence.datetime;
    while (occurrence.datetime <= finalDT) {
      occurrence = this.calculateSingleSeasonOne(currentDT);
      currentDT = occurrence.datetime;
      if (occurrence.datetime < now) {
        this.pastOccurences.push(occurrence);
      } else {
        this.futureOccurences.push(occurrence);
      }
    }

    while (this.futureOccurences.size > 0) {
      result.push(this.futureOccurences.pop());
    }
    while (this.pastOccurences.size > 0) {
      result.push(this.pastOccurences.pop());
    }

    return result.reverse();
  }

  refillBossStack() {
    if (this.bosses.size === 0) {
      this.bosses.push({ order: 15, offset: this.offset, boss: WorldBoss.AS.description });
      this.bosses.push({ order: 14, offset: this.offset, boss: WorldBoss.AS.description });

      this.bosses.push({ order: 13, offset: this.offset, boss: WorldBoss.AV.description });
      this.bosses.push({ order: 12, offset: this.offset, boss: WorldBoss.AV.description });
      this.bosses.push({ order: 11, offset: this.offset, boss: WorldBoss.AV.description });

      this.bosses.push({ order: 10, offset: this.offset, boss: WorldBoss.WD.description });
      this.bosses.push({ order: 9, offset: this.offset, boss: WorldBoss.WD.description });

      this.bosses.push({ order: 8, offset: this.offset, boss: WorldBoss.AS.description });
      this.bosses.push({ order: 7, offset: this.offset, boss: WorldBoss.AS.description });
      this.bosses.push({ order: 6, offset: this.offset, boss: WorldBoss.AS.description });

      this.bosses.push({ order: 5, offset: this.offset, boss: WorldBoss.AV.description });
      this.bosses.push({ order: 4, offset: this.offset, boss: WorldBoss.AV.description });

      this.bosses.push({ order: 3, offset: this.offset, boss: WorldBoss.WD.description });
      this.bosses.push({ order: 2, offset: this.offset, boss: WorldBoss.WD.description });
      this.bosses.push({ order: 1, offset: this.offset, boss: WorldBoss.WD.description });
    }
  }

}

export default WorldBossService;