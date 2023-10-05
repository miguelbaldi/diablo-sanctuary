import React, { useState, useEffect } from "react";
import WorldBossService from "./WorldBoss.service";
import { Interval, DateTime } from "luxon";

function WorldBossSpawnTimerComponent() {
  // Declare a state variable called "count" and initialize it to 0
  const [occurrences, setOccurrences] = useState([]);
  const [parameters, setParameters] = useState({ days: 2, pastEventsSize: 3 });

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
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
              <span className="fs-5 d-none d-sm-inline">Menu</span>
            </a>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li className="nav-item">
                <a href="#" className="nav-link align-middle px-0">
                  <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Home</span>
                </a>
              </li>
              <li>
                <a href="#submenu1" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                  <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Dashboard</span> </a>
                <ul className="collapse show nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
                  <li className="w-100">
                    <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 1 </a>
                  </li>
                  <li>
                    <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 2 </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#" className="nav-link px-0 align-middle">
                  <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Orders</span></a>
              </li>
              <li>
                <a href="#submenu2" data-bs-toggle="collapse" className="nav-link px-0 align-middle ">
                  <i className="fs-4 bi-bootstrap"></i> <span className="ms-1 d-none d-sm-inline">Bootstrap</span></a>
                <ul className="collapse nav flex-column ms-1" id="submenu2" data-bs-parent="#menu">
                  <li className="w-100">
                    <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 1</a>
                  </li>
                  <li>
                    <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 2</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#submenu3" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                  <i className="fs-4 bi-grid"></i> <span className="ms-1 d-none d-sm-inline">Products</span> </a>
                <ul className="collapse nav flex-column ms-1" id="submenu3" data-bs-parent="#menu">
                  <li className="w-100">
                    <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Product</span> 1</a>
                  </li>
                  <li>
                    <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Product</span> 2</a>
                  </li>
                  <li>
                    <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Product</span> 3</a>
                  </li>
                  <li>
                    <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Product</span> 4</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#" className="nav-link px-0 align-middle">
                  <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Customers</span> </a>
              </li>
            </ul>
            <hr />
            <div className="dropdown pb-4">
              <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="data:image/jpeg;base64,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" alt="hugenerd" width="30" height="30" className="rounded-circle" />
                <span className="d-none d-sm-inline mx-1">Deckard Cain</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                <li><a className="dropdown-item" href="#">New project...</a></li>
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><a className="dropdown-item" href="#">Profile</a></li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li><a className="dropdown-item" href="#">Sign out</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col py-3">
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
                }} id="inlineFormInputGroupUsername2" placeholder={"Default to " + parameters.pastEventsSize +" past events"} />
              </div>
              <button type="submit" onClick={() => doIt()} className="btn btn-primary mb-2">Reload</button>
            </form>
          </div>
          <div className="row flex-nowrap">
            <div className="col">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th scope="col" width="5%">#</th>
                    <th scope="col" width="25%">Timer</th>
                    <th scope="col" width="50%">Boss Time</th>
                    <th scope="col" width="20%">Boss</th>
                  </tr>
                </thead>
                <tbody className="overflow-auto">
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
          </div>
        </div>
      </div>
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