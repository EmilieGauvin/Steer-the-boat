import React from 'react';
import Experience from '../Experience/Experience';
import { useState, useEffect } from 'react';
import colorNameToRGB from '../Experience/Utils/colorNameToRGB';
import './StartMenu.css'

export default function StartMenu(props) {
  const experience = new Experience()
  const world = experience.world
  const hPScore = experience.hPScore
  const resources = experience.resources

  const [hideMenu, setHideMenu] = useState(true)
  const [bestMinutes, setBestMinutes] = useState('--')
  const [bestSeconds, setBestSeconds] = useState('--')
  const minutes = props.minutes
  const seconds = props.seconds


  //Update best score when menu is shown
  useEffect(() =>
  {
    if ((minutes === 0) && (seconds === 0))
    {
      setBestMinutes('--')
      setBestSeconds('--')
    }
    else
    {
      if (minutes < bestMinutes) return;
      if ((minutes === bestMinutes) && (seconds <= bestSeconds)) return;

      setBestMinutes(minutes)
      setBestSeconds(seconds)

    }
  }, [hideMenu])

  //When loading is done, show menu
  resources.on('ready', () =>
  {
    setHideMenu(false)
  })

  // when game end, show menu
  hPScore.on('gameEnd', () =>
  {
    setHideMenu(false)

    if (minutes < bestMinutes) return;
    if ((minutes === bestMinutes) && (seconds <= bestSeconds)) return;

    setBestMinutes(minutes)
    setBestSeconds(seconds)
  })
  
  //Change boat color
  const handleClick = (e) =>
  {
    const color = e.target.className
    world.boat.material.color.set(color)
    world.start.origamiBoat.material.color.set(color)
    hPScore.hPDraw.backHPDrawMaterial.uniforms.uColor.value = colorNameToRGB(color)
  }

  //start game (start animation, camera move and time reset)
  const handleStart = () =>
  {
        setHideMenu(true)
        window.setTimeout(() =>
        {
          experience.camera.start()
          experience.time.reset()
        }, 1500)
        experience.world.start.playAnimations()
  }

  return (
    <div className={hideMenu === false ? 'menu hideMenuFalse' : 'menu hideMenuTrue'}>
      <div className=' menuSection game'>
        <h1>Steer the boat to avoid the waves <br/>and try not to get water inside!</h1>
        <h3>How to play :</h3>
        <h3><i>HOLD</i> the steering wheel and <i>SWIPE</i> left or right <br/>or use your left and right keyboard arrows</h3>
      </div>
      <div className=' menuSection chooseColor'>
        <h1 className='color'>Choose color</h1>
        <div className='color'>
        <button className='mediumslateblue' onClick ={handleClick}></button>
          <button className='indigo' onClick ={handleClick}></button>
          <button className='plum' onClick ={handleClick}></button>
          <button className='firebrick' onClick ={handleClick}></button>
          <button className='gold' onClick ={handleClick}></button>
          <button className='olive' onClick ={handleClick}></button>
          <button className='darkseagreen' onClick ={handleClick}></button>
          <button className='darkcyan' onClick ={handleClick}></button>
          <button className='darkslategray' onClick ={handleClick}></button>
        </div>
      </div>
      <div className=' menuSection start'>
        <div>
          <h1>Last score : {minutes === 0 && seconds === 0 ? '--' : minutes < 10 ? "0" + minutes : minutes}:{minutes === 0 && seconds === 0 ? '--' : seconds < 10 ? "0" + seconds : seconds}</h1>
          <h1>Best score : {bestMinutes < 10 ? "0" + bestMinutes : bestMinutes}:{bestSeconds < 10 ? "0" + bestSeconds : bestSeconds}</h1>
        </div>
        <button onClick ={handleStart} ><h1>Start game</h1></button>
      </div>
      <div className=' menuSection bottom'>
          <p>Inspired by Bruno Simon's <a href='https://threejs-journey.com/' target="_blank"><i>Three.js Journey</i></a> class, <i>Raging sea</i>
          <br/>visit portfolio at <a className='textButton' href='http://emiliegauvin.com/' target="_blank"><i>emiliegauvin.com</i></a></p>
      </div>
    </div>
  )
}


