import React, { useState, useEffect } from "react";
import { Interval, DateTime } from "luxon";
import HelltideService from "../services/Helltide.service";
import "../helltide.scss";

function HelltideComponent() {
  const [dropletsSize, setDropletsSize] = useState(250);
  const [droplets, setDroplets] = useState([]);
  // Declare a state variable called "count" and initialize it to 0
  const [occurrences, setOccurrences] = useState([]);
  const [parameters, setParameters] = useState({ days: 2, pastEventsSize: 3 });

  function generateBloodyDropletsFromHell() {
    var result = [];
    for (let index = 0; index < dropletsSize; index++) {
      const element = {
        '--x': Math.floor(Math.random() * 100),
        '--y': Math.floor(Math.random() * 100),
        '--o': Math.random(),
        '--a': Math.random() + 0.5,
        '--d': (Math.random() * 2) - 1,
        '--s': Math.random()
      };
      result.push(element);
    }
    setDroplets(result);
  }

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
    generateBloodyDropletsFromHell();
    doIt();
    // Code here will run after *every* render
    const timer = setTimeout(() => {
      updateTimers();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  function doIt() {
    var resultList = new HelltideService().calculate();
    setOccurrences(resultList);
    console.log(resultList);
  }

  return (
    <>
      <div className="rain">
        {droplets.map(droplet => (
          <svg className="rain__drop" preserveAspectRatio="xMinYMin" viewBox="0 0 5 50" style={droplet}>
            <path stroke="none" d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"></path>
          </svg>
        ))}
      </div>
      <div className="row justify-content-md-center">
        <div className="col-md-auto">
          <h2>Helltide Tracker</h2>
        </div>
      </div>
      <div className="row flex-nowrap">
        <div className="col">
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th scope="col" width="35%">Timer</th>
                  <th scope="col" width="35%">Helltide Time</th>
                </tr>
              </thead>
              <tbody className="overflow-auto">
                {occurrences.map(occurrence => (
                  <tr key={occurrence.toMillis()}>
                    <td className="center">
                      <b className="a-bold">
                        <div className="js-saola-timer" data-date={occurrence.toMillis()}></div>
                      </b>
                    </td>
                    <td className="center">{occurrence.setZone('America/Sao_Paulo').setLocale('pt-BR').toLocaleString(DateTime.DATETIME_SHORT)}</td>
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
export default HelltideComponent;