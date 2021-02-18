import React, {useEffect, useState} from 'react'
import "./GameSession.css"


function GameSession({gameInfo}) {
    return (
        <div className = "gameInfo">
            <h1>{gameInfo.name}</h1>  
            <h3>Player Count: {gameInfo.playerCount}/10</h3>
            {gameInfo.players.map(player => (
                <div>
                    <p>{player}</p>
                </div>
            ))
            }
            <p>Starting amount: {gameInfo.amount} USD</p>
            <p>Duration: {gameInfo.duration}</p>
        </div>
    )
}

export default GameSession
