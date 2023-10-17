import { DateTime, Interval } from "luxon";
import { useCallback, useEffect, useState } from "react";
import HomeService from "../services/Home.service";

const Home = () => {
  const [nextSeason, setNextSeason] = useState();
  const [ready, setReady] = useState(false);
  const updateTimers = useCallback(() => {
    var timers = document.querySelectorAll(".season-js-timer");
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
  }, []);

  const loadNextSeason = useCallback(() => {
    var nextSeasonDT = new HomeService().nextSeason();
    setNextSeason(nextSeasonDT);
    setReady(true);
    console.log(nextSeasonDT);
  }, [setNextSeason, setReady]);

  useEffect(() => {
    loadNextSeason();
    // Code here will run after *every* render
    const timer = setTimeout(() => {
      updateTimers();
    }, 1000);
    return () => clearTimeout(timer);
  }, [loadNextSeason, updateTimers]);

  return (
    <>
      <h1>Home</h1>
      {ready &&
        <div className="row flex-nowrap">
          <div className="col">
            <div className="card border-danger text-bg-secondary text-center">
              <div className="card-header border-danger">
                Next season
              </div>
              <div className="card-body border-danger">
                <h5 className="card-title">{nextSeason.setZone('America/Sao_Paulo').setLocale('pt-BR').toLocaleString(DateTime.DATETIME_SHORT)}</h5>
                <p className="card-text"><b>Season of Blood begins in:</b></p>
              </div>
              <div className="card-footer border-danger text-body-primary">
                <div className="season-js-timer" data-date={nextSeason}>00:00:00</div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Home;
