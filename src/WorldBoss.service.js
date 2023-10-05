import CircularStack from "circular-stack";
import { DateTime, Interval } from "luxon";

class WorldBossService {
  constructor() {
    this.zero = DateTime.fromFormat("13/06/2023 19:04:25", "dd/MM/yyyy HH:mm:ss", { locale: "pt_BR" });
    this.WD = "Wandering Death";
    this.AV = "Avarice";
    this.AS = "Ashava";
    this.bosses = new CircularStack(38);
    this.occurrences = new CircularStack(500);
  }


  isNotAllowedTimeInterval(dt) {
    var time = DateTime.now().set({ hour: dt.hour, minute: dt.minute });
    var first = Interval.after({ hour: 1, minute: 30 }, { hour: 2, minute: 1 });
    var second = Interval.after({ hour: 7, minute: 30 }, { hour: 2, minute: 1 });
    var third = Interval.after({ hour: 13, minute: 30 }, { hour: 2, minute: 1 });
    var fourth = Interval.after({ hour: 19, minute: 30 }, { hour: 2, minute: 1 });
    if (first.contains(time)
      || second.contains(time)
      || third.contains(time)
      || fourth.contains(time)) {
      return false;
    } else {
      return true;
    }
  }

  calculateSingle(baseDT) {
    var currentBoss = this.bosses.pop();
    var currentDT = baseDT.plus({ minute: currentBoss.offset });
    if (this.isNotAllowedTimeInterval(currentDT)) {
      currentDT = currentDT.plus({ hour: 2 });
    }
    var occurrence = {order: currentBoss.order, boss: currentBoss.boss, datetime: currentDT }
    this.occurrences.push(occurrence);
    this.refillBossStack();
    return occurrence;
  }

  calculate() {
    this.refillBossStack();
    //this.bosses.pop();
    var finalDT = DateTime.now().plus({ day: 4 });
    var occurrence = this.calculateSingle(this.zero);
    console.log("Starting calculation from " + this.zero.toISO() + ", to " + finalDT.toISO(), occurrence);
    var currentDT = occurrence.datetime;
    while (occurrence.datetime <= finalDT) {
      occurrence = this.calculateSingle(currentDT);
      currentDT = occurrence.datetime;
      console.log("Occurrence: date=" + occurrence.datetime.toISO() + ", boss=" + occurrence.boss + ", order=" + occurrence.order);
    }
    return this.occurrences;
  }


  refillBossStack() {
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