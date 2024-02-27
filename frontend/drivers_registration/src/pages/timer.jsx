import React, { useState, useEffect } from 'react';

const Timers = () => {
  const [milliseconds, setMilliseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lapTimes, setLapTimes] = useState([]);
  
  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setMilliseconds((prevMilliseconds) => prevMilliseconds + 1000);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
    console.log("Timer Started");
  };

  const stopTimer = () => {
    setIsRunning(false);
    console.log("Timer Stopped");
  };

  const resetTime = () => {
    setMilliseconds(0);
    setLapTimes([]);
    console.log("Timer Reset");
  };

  const lapTime = () => {
    console.log("Timer Lap");
    const lapTimeString = formatTime(milliseconds);
    setLapTimes((prevLapTimes) => [...prevLapTimes, lapTimeString]);
  };

  // Format milliseconds into HH:mm:ss
  const formatTime = (timeInMilliseconds) => {
    const seconds = Math.floor(timeInMilliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formatNumber = (num) => (num < 10 ? `0${num}` : num);

    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(remainingSeconds)}`;
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1>Timers</h1>
        </div>
        {/* start stop reset time */}
        <div className="col-md-12">
          <div className="col">
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  <h1>
                    <span id="sec">{formatTime(milliseconds)}</span>
                  </h1>
                  <button className="btn btn-success me-1" onClick={startTimer}>
                    Start
                  </button>
                  <button className="btn btn-danger me-1" onClick={stopTimer}>
                    Stop
                  </button>
                  <button className="btn btn-warning me-1" onClick={resetTime}>
                    Reset
                  </button>
                  <button className="btn btn-info" onClick={lapTime}>
                    Lap
                  </button>
                </div>
                <div className="card-footer">
                  <h3>Lap:</h3>
                  <ul className="list-group">
                    {lapTimes.map((lap, index) => (
                      <li className="list-group-item" key={index}>{lap}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timers;