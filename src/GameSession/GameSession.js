import React from 'react'
import "./GameSession.css"


function GameSession({gameInfo}) {
    return (
        <div className = "gameInfo">
            
            <h1>{gameInfo.name}</h1>  
            <div>

            <h3 className = "players">Player Count: {gameInfo.playerCount}/10</h3>
                {gameInfo.players.map(player => (
                    <div>
                        <p>{player}</p>
                    </div>
                ))
                }
            </div>

            <p>Starting amount: {gameInfo.amount} USD</p>
            <p>Duration: {gameInfo.duration}</p>
            <p>Game begins: 12:00:00 AM</p>
        </div>
    )
}

export default GameSession
