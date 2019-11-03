import React from 'react';
import Typography from '@material-ui/core/Typography';
import Draggable from 'react-draggable'; // The default


export default function Card({ item, isFlipped, onCardMoved, onCardSwiped, startGame }) {

    /**
     * 
     * Events from Draggable interface
     * 
     */
    function onDragStart(e, position) {
        console.log(e, position)
    }

    function onDragStop(e, position) {
        console.log(e, position)

        // user is selecting an answer
        if (position.lastX < -100 || position.lastX > 100) {
            onCardSwiped(true) // swipe successful
        } else {
            onCardSwiped(false) // swipe not finished
        }
    }

    function onDrag(e, position) {

        onCardMoved(position.lastX)
    }

    return (
        <Draggable
            position={{ x: 0, y: 0 }}
            bounds={{ top: -100, left: -200, right: 200, bottom: 0 }}
            onStart={onDragStart}
            onStop={onDragStop}
            onDrag={onDrag}
        >
            <div
                onClick={() => startGame()}
                className="flip-card center"
                style={{ marginTop: '10vh' }}
            >

                <div className={isFlipped ? "flip-card-inner-rotated" : "flip-card-inner"}>
                    <div className="flip-card-front">

                        <img src="card-back.jpg" alt="Avatar" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div className="flip-card-back">
                        <Typography variant="h4" gutterBottom style={{ paddingTop: '10%' }}>
                            {item.item}
                        </Typography>
                        {
                            item.forbidden_words.map(forbidden_word => {
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
    )
}