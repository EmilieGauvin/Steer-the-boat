import { useState, useEffect } from 'react'
import Timer from "./Timer/Timer";
import StartMenu from "./StartMenu/StartMenu";
import './App.css'

export default function App() {

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);


  const changeTimer = (newMinutes, newSeconds) => {
    setMinutes(newMinutes);
    setSeconds(newSeconds);
  }


  return (
    <div className="app">
      <StartMenu minutes={minutes} seconds={seconds}/>
      <Timer onChange={changeTimer}/>
    </div>
  )
}

