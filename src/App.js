import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

import Reward from 'react-rewards'
import Draggable from 'react-draggable'; // The default

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appbar: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    position: 'fixed'
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
}));

function App() {
  const classes = useStyles();

  const [isFlipped, setisFlipped] = useState(false)
  const [remainingTime, setRemainingTime] = useState(60) // in seconds

  const [overlayColor, setOverlayColor] = useState('rgba(255, 255, 255, 0.0)')
  const [overlayText, setOverlayText] = useState('')

  const airhorn = new Audio("airhorn.mp3")
  const confetti = useRef(undefined)

  useEffect(() => {

    if(!isFlipped)
      return;

    if (!remainingTime)
      return;

    const intervalId = setInterval(()=> {
      setRemainingTime(remainingTime - 1)
    }, 1000)

    return () => clearInterval(intervalId)

  }, [remainingTime, isFlipped])

  useEffect(() => {
    confetti.current.rewardMe()
  }, [])

  function onDragStart(e, position){
    console.log(e, position)
  }

  function onDragStop(e, position){
    console.log(e, position)

    // user is selecting an answer
    if(position.lastX < -100 || position.lastX > 100){
      confetti.current.rewardMe()    
      setisFlipped(false)
      setRemainingTime(60)
    }  
    setOverlayText("")
    setOverlayColor(`rgba(0,0,0,0)`)

  }

  function onDrag(e, position){

    /**
     * calculate the new color
     * 
     * positive x = green
     * negative x = red
     */

     if(position.lastX > 0){
       setOverlayColor(`rgba(45,128,10,${position.lastX / 150 - 0.4})`)
       setOverlayText("SOLVED")
     }
     if(position.lastX < 0){
      setOverlayColor(`rgba(200,20,20,${position.lastX / -150 - 0.4})`)
      setOverlayText("FAILED")
    }
  }

  return (
    <div>
      <AppBar className={classes.appbar} >
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {parseInt(remainingTime / 60) }:{ String(remainingTime % 60).padStart(2, "0")}
          </Typography>
        </Toolbar>
      </AppBar>


      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: overlayColor,
        zIndex: 1001,
        pointerEvents: 'none'
      }}>
        <Typography variant="h3" style={{textAlign: 'center', paddingTop: '40vh', color: 'white'}}>
          {overlayText}
        </Typography>
      </div>

      <Draggable
        position={{x: 0, y: 0}}
        bounds={{top: -100, left: -200, right: 200, bottom: 0}}
        onStart={onDragStart}
        onStop={onDragStop}
        onDrag={onDrag}
        >
        <div 
          onClick={() => setisFlipped(true)} 
          className="flip-card center"
          style={{marginTop: '10vh'}}
          >
            
          <div className={isFlipped ? "flip-card-inner-rotated" : "flip-card-inner"}>
            <div className="flip-card-front">
            <Reward type="confetti" ref={(r) => confetti.current = r} config={{
              zIndex: '1000',
              lifetime: '200',
              elementCount: '80',
              elementSize: '15',
              startVelocity: '15',
              spread: '90'
            }}>
              <div>{/** this div is only here to fulfill the required children prop for Reward */}</div>                
            </Reward>
            <img src="card-back.jpg" alt="Avatar" style={{ width: '100%', height: '100%' }} />
            </div>
            <div className="flip-card-back">
              <Typography variant="h3" gutterBottom style={{ paddingTop: '10%' }}>
                Gewürzgurke
                </Typography>
              {
                ['Essen', 'Oma und Opa', 'Angebot', 'Snack'].map(forbidden_word => {
                  return (
                    <Typography key={forbidden_word} variant="h5" style={{ paddingTop: '10%', color: 'lightgray' }}>
                      {forbidden_word}
                    </Typography>
                  )
                })
              }
            </div>
          </div>
        </div>

      </Draggable>

      <div className="center">
        <Typography variant="h6">
          Click the card to start the timer.
        </Typography>
      </div>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="open drawer">
            <MenuIcon />
          </IconButton>
          
          <Fab size="large" color="secondary" aria-label="add" className={classes.fabButton} onClick={() => {
            if (airhorn.paused) {
              airhorn.play()
            } else {
              airhorn.currentTime = 0
            }
          }}>
            <VolumeUpIcon />
          </Fab>
        </Toolbar>
      </AppBar>

    </div>
  );
}

export default App;
