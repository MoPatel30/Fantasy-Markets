import React from 'react'



function GameModal({ gameInfo }) {
    return (
        <div>
            <p>test</p>
            <div id="spanner">
                <span><u>Name: {gameInfo.data().name}</u></span>
                <span><u>Creator: {gameInfo.data().creator}</u></span>
            </div>


            <div id="non-spanner">
                <h3>Starting Amount: {gameInfo.data().starting_amount} USD</h3>
                <h3>Duration: {gameInfo.data().duration - 1} {gameInfo.data().duration - 1 === 1 ? `week`: `weeks`}</h3>
            </div>
        

            <div id="non-spanner">
                <h3>Start date: {gameInfo.data().start_date}</h3>
                <h3>End date: {gameInfo.data().end_date}</h3>
            </div>


            <div id="spanner">                                 
                <span>Players: 1 / {gameInfo.data().max_players}</span>
                {1 < gameInfo.data().max_players ? (
                <button value={`${gameInfo.id}`}>Join</button>
                ): (
                    <p></p>
                )
                }
            </div>
        </div>
    )
}

export default GameModal
