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
    var finalDT = DateTime.local({ zone: 'UTC-4' }).plus(this.duration);
    var currentDT = this.zero.plus(this.offset);
    futureOccurences.push(currentDT);
    var now = DateTime.local({ zone: 'UTC-4' });
    while(currentDT < finalDT) {
      currentDT = currentDT.plus(this.offset);
      futureOccurences.push(currentDT);
    }
    var result = [];
    while (futureOccurences.size > 0) {
      result.push(futureOccurences.pop());
    }
    return result.reverse();
  }

}

export default HelltideService;