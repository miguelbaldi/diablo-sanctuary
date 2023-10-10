import React, { useState, useEffect, useCallback } from "react";
import { Interval, DateTime, Duration } from "luxon";
import HelltideService from "../services/Helltide.service";
import "../helltide.scss";

function HelltideComponent() {
  const DEFAULT_DROPLETS_SIZE = 250;
  const [dropletsSize, setDropletsSize] = useState(DEFAULT_DROPLETS_SIZE);
  const [ready, setReady] = useState(false);
  const [droplets, setDroplets] = useState([]);
  // Declare a state variable called "count" and initialize it to 0
  const [occurrences, setOccurrences] = useState({});

  const generateBloodyDropletsFromHell = useCallback(() => {
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
  }, [dropletsSize, setDroplets]);

  const updateTimers = useCallback(() => {
    var timers = document.querySelectorAll(".helltide-js-timer");
    timers.forEach(timer => {
      var now = DateTime.local({ zone: 'UTC-4' });
      var occurrenceDT = DateTime.fromMillis(parseInt(timer.dataset.date));
      var duration;
      var durationFormatted;
      if (occurrenceDT > now) {
        duration = Interval.fromDateTimes(now, occurrenceDT).toDuration().rescale().reconfigure({ locale: 'pt-BR' });
      } else {
        duration = Interval.fromDateTimes(now, occurrenceDT.plus(Duration.fromISO("PT1H"))).toDuration().rescale().reconfigure({ locale: 'pt-BR' });
      }
      durationFormatted = duration.toFormat("hh':'mm':'ss")
      if (duration.as('minute') <= 30) {
        timer.classList.add('text-danger');
      } else {
        timer.classList.remove('text-danger');
      }
      timer.innerHTML = durationFormatted;

    });
    setTimeout(() => { updateTimers() }, 1000);
  }, []);

  const toggleBloodyRain = useCallback(() => {
    if (dropletsSize > 0) {
      setDropletsSize(0);
    } else {
      setDropletsSize(DEFAULT_DROPLETS_SIZE);
    }
  }, [setDropletsSize, dropletsSize]);

  function getCardFooterClass(occ) {
    if (occ.active) {
      return "card-footer border-danger text-body-primary";
    } else {
      return "card-footer border-danger";
    }
  }

  useEffect(() => {
    generateBloodyDropletsFromHell();
    doIt();
    setReady(true);
    // Code here will run after *every* render
    const timer = setTimeout(() => {
      updateTimers();
    }, 1000);
    return () => clearTimeout(timer);
  }, [generateBloodyDropletsFromHell, updateTimers]);

  function doIt() {
    var resultList = new HelltideService().calculate();
    setOccurrences(resultList);
    console.log(resultList);
  }

  return (
    <>
      <button type="button" className="btn btn-primary float right" onClick={toggleBloodyRain}>
        <i className={dropletsSize > 0 ? "bi bi-droplet" : "bi bi-droplet-fill"}></i>
      </button>
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
      {ready &&
        <div className="row flex-nowrap">
          <div className="col">
            <div className="card border-danger text-bg-secondary text-center">
              <div className="card-header border-danger">
                {occurrences.first.active ? "Current" : "Next"}
              </div>
              <div className="card-body border-danger">
                <h5 className="card-title">{occurrences.first.datetime.setZone('America/Sao_Paulo').setLocale('pt-BR').toLocaleString(DateTime.DATETIME_SHORT)}</h5>
                <p className="card-text">{occurrences.first.active ? "Helltide active." : "Helltide inactive"}</p>
              </div>
              <div className={getCardFooterClass(occurrences.first)}>
                <div className="helltide-js-timer" data-active={occurrences.first.active} data-date={occurrences.first.datetime}>00:00:00</div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card border-danger text-bg-dark text-center">
              <div className="card-header border-danger">
                {occurrences.second.active ? "Current" : "Next"}
              </div>
              <div className="card-body border-danger">
                <h5 className="card-title">{occurrences.second.datetime.setZone('America/Sao_Paulo').setLocale('pt-BR').toLocaleString(DateTime.DATETIME_SHORT)}</h5>
                <p className="card-text">{occurrences.second.active ? "Helltide active." : "Helltide inactive"}</p>
              </div>
              <div className={getCardFooterClass(occurrences.first)}>
                <div className="helltide-js-timer" data-active={occurrences.second.active} data-date={occurrences.second.datetime}>00:00:00</div>
              </div>
            </div>
          </div>
        </div>
      }
    </>

  );
}
export default HelltideComponent;