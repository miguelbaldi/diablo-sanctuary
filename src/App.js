import React, { useState, useEffect } from "react";
import WorldBossService from "./WorldBoss.service";
import { Interval, DateTime } from "luxon";

function WorldBossSpawnTimerComponent() {
  // Declare a state variable called "count" and initialize it to 0
  const [occurrences, setOccurrences] = useState([]);

  function updateTimers() {
    var timers = document.querySelectorAll(".js-saola-timer");
    timers.forEach(timer => {
      var now = DateTime.now();
      var occurrenceDT = DateTime.fromMillis(parseInt(timer.dataset.date));
      var i = Math.floor((occurrenceDT - now) / 1000);
      if (i >= 0) {
        var duration = Interval.fromDateTimes(now, occurrenceDT).toDuration().rescale().reconfigure({ locale: 'pt-BR' });
        if (duration.as('minute') <= 30) {
          timer.classList.add('text-danger');
        } else {
          timer.classList.remove('text-danger');
        }
        timer.innerHTML = Interval.fromDateTimes(now, occurrenceDT).toDuration().rescale().reconfigure({ locale: 'pt-BR' }).toFormat("d 'dias,' hh':'mm':'ss");
      }
    });
    setTimeout(() => { updateTimers() }, 1000);
  }

  useEffect(() => {
    doIt();
    // Code here will run after *every* render
    const timer = setTimeout(() => {
      updateTimers();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  function doIt() {
    var result = new WorldBossService().calculate();
    var resultList = [];
    while (result.size > 0) {
      var data = result.pop();
      console.log("Result row", data);
      resultList.push(data);
    }
    setOccurrences(resultList.reverse());
    console.log(resultList);
  }


  function colorByBoss(occurrence) {
    var className;
    switch (occurrence.boss) {
      case "Wandering Death":
        className = "table-primary";
        break;
      case "Avarice":
        className = "table-warning";
        break;
      case "Ashava":
        className = "table-success";
        break;
      default:
        className = "table-light";
    }
    if (occurrence.order === 1){
      className = className + " table-line-order";
    }
    return className;
  }

  return (
    <div>
      <h2>World Boss Timer and Spawn Time Schedule</h2>
      <table className="table table-sm">
        <thead>
          <tr>
            <th scope="col" width="5%">#</th>
            <th scope="col" width="25%">Timer</th>
            <th scope="col" width="50%">Boss Time</th>
            <th scope="col" width="20%">Boss</th>
          </tr>
        </thead>
        <tbody>
          {occurrences.map(occurrence => (
            <tr key={occurrence.datetime.toMillis()} className={colorByBoss(occurrence)}>
              <td className="center">{occurrence.order}</td>
              <td className="center">
                <b className="a-bold">
                  <div className="js-saola-timer" data-date={occurrence.datetime.toMillis()}></div>
                </b>
              </td>
              <td className="center">{occurrence.datetime.setLocale('pt-BR').toLocaleString(DateTime.DATETIME_SHORT)}</td>
              <td className="center">{occurrence.boss}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  return (
    <div>
      <WorldBossSpawnTimerComponent />
    </div>
  );
}

export default App;