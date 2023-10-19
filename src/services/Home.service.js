import { DateTime } from "luxon";

class HomeService {
  constructor() {
    this.nextSeasonDateTime = DateTime.fromISO('2023-10-17T14:00:00.000-03:00').setZone('UTC-4');
    this.endSeasonDateTime = DateTime.fromISO('2024-01-24T00:00:00.000-03:00').setZone('UTC-4');
  }

  nextSeason() {
    return this.nextSeasonDateTime;
  }
  endSeason() {
    return this.endSeasonDateTime;
  }
}
export default HomeService;