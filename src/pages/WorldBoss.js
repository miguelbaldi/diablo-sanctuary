import React, { useState, useEffect } from "react";
import WorldBossService from "../services/WorldBoss.service";
import { Interval, DateTime } from "luxon";

function WorldBossSpawnTimerComponent() {
  // Declare a state variable called "count" and initialize it to 0
  const [occurrences, setOccurrences] = useState([]);
  const [parameters, setParameters] = useState({ days: 2, pastEventsSize: 3 });

  function updateTimers() {
    var timers = document.querySelectorAll(".js-saola-timer");
    timers.forEach(timer => {
      var now = DateTime.local({ zone: 'UTC-4' });
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
    var resultList = new WorldBossService().calculate(parameters);
    setOccurrences(resultList);
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
    if (occurrence.order === 1) {
      className = className + " table-line-order";
    }
    return className;
  }

  return (
        <>
          <div className="row justify-content-md-center">
            <div className="col-md-auto">
              <h2>World Boss Timer and Spawn Time Schedule</h2>
            </div>
          </div>
          <div className="row flex-nowrap">
            <form className="form-inline">
              <label className="sr-only" for="inlineFormInputName2">Number of days to preview</label>
              <input type="text" className="form-control mb-2 mr-sm-2" onChange={(event) => {
                if (event.target.value) {
                  setParameters({ days: parseInt(event.target.value), pastEventsSize: parameters.pastEventsSize });
                }
              }} id="inlineFormInputName2" placeholder={"Default to " + parameters.days + " days"} />
              <label className="sr-only" for="inlineFormInputGroupUsername2">Number of past events</label>
              <div className="input-group mb-2 mr-sm-2">
                <input type="text" className="form-control" onChange={(event) => {
                  if (event.target.value) {
                    setParameters({ pastEventsSize: parseInt(event.target.value), days: parameters.days });
                  }
                }} id="inlineFormInputGroupUsername2" placeholder={"Default to " + parameters.pastEventsSize + " past events"} />
              </div>
              <button type="button" onClick={() => doIt()} className="btn btn-primary mb-2">Reload</button>
            </form>
          </div>
          <div className="row flex-nowrap">
            <div className="col">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th scope="col" width="5%">#</th>
                      <th scope="col" width="35%">Timer</th>
                      <th scope="col" width="35%">Boss Time</th>
                      <th scope="col" width="25%">Boss</th>
                    </tr>
                  </thead>
                  <tbody className="overflow-auto">
                    {occurrences.map(occurrence => (
                      <tr key={occurrence.datetime.toMillis()} className={colorByBoss(occurrence)}>
                        <td className={occurrence.extraTime ? "center fw-bold":"center"}>{occurrence.order}</td>
                        <td className="center">
                          <b className="a-bold">
                            <div className="js-saola-timer" data-date={occurrence.datetime.toMillis()}></div>
                          </b>
                        </td>
                        <td className="center">{occurrence.datetime.setZone('America/Sao_Paulo').setLocale('pt-BR').toLocaleString(DateTime.DATETIME_SHORT)}</td>
                        <td className="center">{occurrence.boss}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>

  );
}
export default WorldBossSpawnTimerComponent;