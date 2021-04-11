import React, {useEffect, useState} from 'react'
import firebase from "firebase"
import { db } from "../firebase"
import store from "../Redux/index"
import "./GameModal.css"
import Portfolio from "../Portfolio/Portfolio"

function GameModal({ gameInfo }) {
    const [EditPortfolio, setEditPortfolio] = useState()
    const [players, setPlayers] = useState([])

    useEffect(() => {
        gameInfo.data().players.forEach((player) => {setPlayers([...players, Object.keys(player)[0]])})
    }, [])

    function joinGameSession(e){
        e.preventDefault()
        
        if(players.indexOf(store.getState().email) === -1){
            db.collection("current_games").doc(e.target.value).update({
                player_count: firebase.firestore.FieldValue.increment(1),
                players: firebase.firestore.FieldValue.arrayUnion( {[store.getState().email]: {cash: "6696"}} )  
            })
            db.collection("users").doc(`${store.getState().userInfo.email}`).update({
                current_games: firebase.firestore.FieldValue.arrayUnion(e.target.value)
            })
        }
    }

    function displayPortfolio(email){
        setEditPortfolio(<Portfolio name={email} />)
    }

    return (
        <div>
            <div id="game-info">
                <div id="game-name-creator">
                    <h1><u>{gameInfo.data().name}</u></h1>
                    <h3>Created by {gameInfo.data().creator}</h3>
                </div>
        
                <div>
                    <h2><u>Game Information:</u></h2>
                    <h3>Starting Amount: {gameInfo.data().starting_amount} USD</h3>
                    <h3>Duration: {gameInfo.data().duration - 1} {gameInfo.data().duration - 1 === 1 ? `week`: `weeks`}</h3>
                
                    <h3>Start date: {gameInfo.data().start_date}</h3>
                    <h3>End date: {gameInfo.data().end_date}</h3>
                                    
                    <h3>Players: {gameInfo.data().player_count} / {gameInfo.data().max_players}</h3>
                </div>
            </div>
         
            {gameInfo.data().player_count < gameInfo.data().max_players ? (
                <div>
                    <button value={`${gameInfo.id}`} onClick={joinGameSession}>Join</button> 
                </div>
            ): (
                <p></p>
            )
            }

            <div id="game-players">
                <h2>Current Players:</h2>
                {gameInfo.data().players ? (
                    console.log(gameInfo.data().players),
                    gameInfo.data().players.map((player) => (
                        <div id="leaderboard">
                            <span>{Object.keys(player)[0]}</span>
                            <span id="portfolio-btns">
                                {store.getState().email === Object.keys(player)[0] ? (
                                    <span>
                                        <span onClick={() => {displayPortfolio(Object.keys(player)[0])}} className="edit-portfolio-btn"><u>Edit Portfolio</u></span>
                                        <span className="view-portfolio-btn"><u>View Portfolio</u></span>
                                    </span>
                                    ) : (
                                        <span className="view-portfolio-btn"><u>View Portfolio</u></span>
                                    )
                                }
                            </span>            
                        </div>
                    ))
                ): (
                    <p>No Players Found</p>
                )
                }
                </div>

            <div>
                <h1>General Rules</h1>
                <h3>1.) Rule #1</h3>
                <h3>2.) Rule #2</h3>
                <h3>3.) Rule #3</h3>
                <h3>4.) Rule #4</h3>
                <h3>5.) Rule #5</h3>
            </div>

            <div>{EditPortfolio}</div>
        </div>
    )
}

export default GameModal
