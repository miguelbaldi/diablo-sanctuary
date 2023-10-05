import CircularStack from "circular-stack";
import { DateTime, Interval, Duration } from "luxon";

class WorldBossService {
  constructor() {
    //this.zero = DateTime.fromFormat("13/06/2023 19:02:00", "dd/MM/yyyy HH:mm:ss", { zone: "UTC-4" });
    // this.zero = DateTime.local(2023, 6, 13, 19, 2, 0, 0, { zone: 'UTC-4' });
    this.zero = DateTime.local(2023, 10, 5, 13, 55, 43, 0, { zone: 'UTC-4' });
    this.WD = "Wandering Death";
    this.AV = "Avarice";
    this.AS = "Ashava";
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
    if (this.checkTimeInterval(time, firstStart, firstEnd)      || 
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

  calculateSingle(baseDT) {
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

  calculate(parameters) {
    this.occurrences = [];
    this.pastOccurences = new CircularStack(parameters.pastEventsSize + 1);
    this.futureOccurences = new CircularStack((parameters.days * 4) + 4);
    this.refillBossStack();
    var now = DateTime.local({ zone: 'UTC-4' });
    var finalDT = DateTime.local({ zone: 'UTC-4' }).plus({ day: parameters.days });
    console.log("Starting calculation from " + this.zero.toISO() + ", to " + finalDT.toISO());
    var occurrence = this.calculateSingle(this.zero);
    this.pastOccurences.push(occurrence);
    var currentDT = occurrence.datetime;
    while (occurrence.datetime <= finalDT) {
      occurrence = this.calculateSingle(currentDT);
      currentDT = occurrence.datetime;
      if (occurrence.datetime < now) {
        this.pastOccurences.push(occurrence);
      } else {
        this.futureOccurences.push(occurrence);
      }
      //console.log("Occurrence: date=" + occurrence.datetime.toISO() + ", boss=" + occurrence.boss + ", order=" + occurrence.order);
    }

    while (this.futureOccurences.size > 0) {
      this.occurrences.push(this.futureOccurences.pop());
    }
    while (this.pastOccurences.size > 0) {
      this.occurrences.push(this.pastOccurences.pop());
    }

    return this.occurrences.reverse();
  }


  refillBossStack() {
    if (this.bosses.size === 0) {
      this.bosses.push({ order: 4, offset: Duration.fromISO('PT5H53M30S'), boss: this.AS });
      this.bosses.push({ order: 3, offset: Duration.fromISO('PT5H53M29S'), boss: this.AS });
      this.bosses.push({ order: 2, offset: Duration.fromISO('PT5H25M13S'), boss: this.AS });
      this.bosses.push({ order: 1, offset: Duration.fromISO('PT5H53M30S'), boss: this.AS });
      this.bosses.push({ order: 5, offset: Duration.fromISO('PT5H25M13S'), boss: this.AS });
    }
  }

  refillBossStackOld() {
    if (this.bosses.size === 0) {
      this.bosses.push({ order: 37, offset: 353.00, boss: this.AV });
      this.bosses.push({ order: 36, offset: 325.22, boss: this.AV });
      this.bosses.push({ order: 35, offset: 353.49, boss: this.WD });
      this.bosses.push({ order: 34, offset: 325.72, boss: this.WD });
      this.bosses.push({ order: 33, offset: 353.49, boss: this.AS });
      this.bosses.push({ order: 32, offset: 353.00, boss: this.AS });
      this.bosses.push({ order: 31, offset: 325.22, boss: this.AS });
      this.bosses.push({ order: 30, offset: 353.49, boss: this.AV });
      this.bosses.push({ order: 29, offset: 325.72, boss: this.AV });
      this.bosses.push({ order: 28, offset: 353.49, boss: this.WD });
      this.bosses.push({ order: 27, offset: 353.00, boss: this.WD });
      this.bosses.push({ order: 26, offset: 325.22, boss: this.WD });
      this.bosses.push({ order: 25, offset: 353.49, boss: this.AS });
      this.bosses.push({ order: 24, offset: 325.72, boss: this.AS });
      this.bosses.push({ order: 23, offset: 353.49, boss: this.AV });
      this.bosses.push({ order: 22, offset: 353.00, boss: this.AV });
      this.bosses.push({ order: 21, offset: 325.22, boss: this.AV });
      this.bosses.push({ order: 20, offset: 353.49, boss: this.WD });
      this.bosses.push({ order: 19, offset: 325.72, boss: this.WD });
      this.bosses.push({ order: 18, offset: 353.49, boss: this.AS });
      this.bosses.push({ order: 17, offset: 353.00, boss: this.AS });
      this.bosses.push({ order: 16, offset: 325.22, boss: this.AS });
      this.bosses.push({ order: 15, offset: 353.49, boss: this.AV });
      this.bosses.push({ order: 14, offset: 325.72, boss: this.AV });
      this.bosses.push({ order: 13, offset: 353.49, boss: this.WD });
      this.bosses.push({ order: 12, offset: 353.00, boss: this.WD });
      this.bosses.push({ order: 11, offset: 325.22, boss: this.WD });
      this.bosses.push({ order: 10, offset: 353.49, boss: this.AS });
      this.bosses.push({ order: 9, offset: 325.72, boss: this.AS });
      this.bosses.push({ order: 8, offset: 353.49, boss: this.AV });
      this.bosses.push({ order: 7, offset: 353.00, boss: this.AV });
      this.bosses.push({ order: 6, offset: 325.22, boss: this.AV });
      this.bosses.push({ order: 5, offset: 353.49, boss: this.WD });
      this.bosses.push({ order: 4, offset: 325.72, boss: this.WD });
      this.bosses.push({ order: 3, offset: 353.49, boss: this.AS });
      this.bosses.push({ order: 2, offset: 353.00, boss: this.AS });
      this.bosses.push({ order: 1, offset: 325.22, boss: this.AS });
    }
  }
}

export default WorldBossService;