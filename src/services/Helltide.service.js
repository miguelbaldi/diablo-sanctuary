import CircularStack from "circular-stack";
import { DateTime, Duration } from "luxon";

class HelltideService {
  constructor() {
    this.zero = DateTime.local(2023, 10, 9, 8, 15, 0, 0, { zone: 'UTC-4' });
    this.duration = Duration.fromISO("PT1H");
    this.offset = Duration.fromISO("PT2H15M");

  }

  calculate() {
    var futureOccurences = new CircularStack(10);
    var finalDT = DateTime.local({ zone: 'UTC-4' }).plus(this.offset);
    var currentDT = this.zero.plus(this.offset);
    futureOccurences.push(currentDT);
    var now = DateTime.local({ zone: 'UTC-4' });
    var nowMinusDuration = now.minus(this.duration);
    while (currentDT < finalDT) {
      currentDT = currentDT.plus(this.offset);

      futureOccurences.push(currentDT);
    }
    var result = [];
    while (futureOccurences.size > 0) {
      var occ = futureOccurences.pop();
      if (occ >= nowMinusDuration && occ <= now) {
        result.push({ active: true, datetime: occ });
      } else if (occ > now) {
        result.push({ active: false, datetime: occ });
      }
    }
    result = result.reverse().slice(0, 2);
    result = { first: result[0], second: result[1] };
    return result;
  }

}

export default HelltideService;