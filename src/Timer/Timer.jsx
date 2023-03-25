import React from 'react';
import Experience from '../Experience/Experience';
import { useState, useEffect } from 'react';
import './Timer.css'

export default function Timer(props) {
  const [timerOn, setTimerOn] = useState(false)
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [hideTimer, setHideTimer] = useState(true)

  const experience = new Experience()
  const hPScore = experience.hPScore
  const resources = experience.resources

  const start = Date.now();

  const getTime = () => {
    const time = Date.now() - start;
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    if (timerOn === true)
    {
        const interval = setInterval(() => getTime(), 1000);
        return () => clearInterval(interval);
    }
  }, [timerOn]);

  hPScore.on('gameEnd', () =>
  {
    setTimerOn(false)
    props.onChange(minutes, seconds)
  })

  hPScore.on('gameStart', () =>
  {
    setMinutes(0)
    setSeconds(0)
    setTimerOn(true)
  })

  resources.on('ready', () =>
  {
    setHideTimer(false)
  })

  return (
    <div className={hideTimer === false ? 'timer hideTimerFalse' : 'timer hideTimerTrue'} role="timer">
      <div className="box">
          <span id="minute">{minutes < 10 ? "0" + minutes : minutes}:{seconds < 10 ? "0" + seconds : seconds}</span>
        </div>
    </div>
  );
};
