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
import Card from './components/Card';

import cards from './_cards'

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
    position: 'fixed',
    backgroundColor: '#01579b'
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

  const [currentCard, setCurrentCard] = useState({item: '', forbidden_words: []})

  const [gameRunning, setGameRunning] = useState(false)
  const [remainingTime, setRemainingTime] = useState(60) // in seconds

  const [overlayColor, setOverlayColor] = useState('rgba(255, 255, 255, 0.0)')
  const [overlayText, setOverlayText] = useState('')

  const [topAppbarBackgroundColor, setTopAppbarBackgroundColor] = useState('#01579b')

  const airhorn = new Audio("airhorn.mp3")

  const confetti = useRef(undefined)

  // update game timer
  useEffect(() => {

    if (!gameRunning)
      return;

    if (!remainingTime){
      playAirhorn()
      return;
    }
    const intervalId = setInterval(() => {
      setRemainingTime(remainingTime - 1)
      
    }, 1000)

    if(remainingTime < 10){
      setTopAppbarBackgroundColor('#d84315')
    }else{
      setTopAppbarBackgroundColor('#01579b')
    }

    return () => clearInterval(intervalId)

  }, [remainingTime, gameRunning])

  // initial startup
  useEffect(() => {
    confetti.current.rewardMe()
    drawNewCard()
  }, [])

  // get random item from array of items
  function drawNewCard(){
    const newCard = cards[Math.floor(Math.random() * cards.length)]
    setCurrentCard(newCard)

  }

  // reset game if card is swiped to left or right
  function onCardSwiped(swipeFinished) {
    if (swipeFinished) {
      confetti.current.rewardMe()
      setGameRunning(false)
      setRemainingTime(60)
    }
    setOverlayText("")
    setOverlayColor(`rgba(0,0,0,0)`)
  }

  function playAirhorn(){
    if (airhorn.paused) {
      airhorn.play()
    } else {
      airhorn.currentTime = 0
    }
  }

  // update overlay during swipe
  function onCardMoved(xPosition) {

    /**
     * calculate the new color
     * 
     * positive x = green
     * negative x = red
     */
    if (xPosition > 0) {
      setOverlayColor(`rgba(45,128,10,${xPosition / 150 - 0.4})`)
      setOverlayText("SOLVED")
    }
    if (xPosition < 0) {
      setOverlayColor(`rgba(200,20,20,${xPosition / -150 - 0.4})`)
      setOverlayText("FAILED")
    }
  }


  return (
    <div>
      <AppBar className={classes.appbar} style={{backgroundColor: topAppbarBackgroundColor}} >
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {parseInt(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, "0")}
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
        <Typography variant="h3" style={{ textAlign: 'center', paddingTop: '40vh', color: 'white' }}>
          {overlayText}
        </Typography>
      </div>

      <Reward type="confetti" ref={(r) => confetti.current = r} config={{
        angle: "0",
        zIndex: '1000',
        lifetime: '200',
        elementCount: '80',
        elementSize: '15',
        startVelocity: '20',
        spread: '90'
      }}>
        <Card
          item={currentCard}
          isFlipped={gameRunning}
          onCardSwiped={onCardSwiped}
          onCardMoved={onCardMoved}
          startGame={() => setGameRunning(true)} />
      </Reward>


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
            playAirhorn();
          }}>
            <VolumeUpIcon />
          </Fab>
        </Toolbar>
      </AppBar>

    </div>
  );
}

export default App;
