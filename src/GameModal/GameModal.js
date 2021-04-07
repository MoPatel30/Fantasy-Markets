import React from 'react'
import firebase from "firebase"
import { db } from "../firebase"
import store from "../Redux/index"


function GameModal({ gameInfo }) {

    function joinGameSession(e){
        e.preventDefault()

        db.collection("current_games").doc(e.target.value).update({
            player_count: firebase.firestore.FieldValue.increment(1),
            players: firebase.firestore.FieldValue.arrayUnion( {[store.getState().email]: {cash: "6696"}} )  
        })
        
        db.collection("users").doc(`${store.getState().userInfo.email}`).update({
            current_games: firebase.firestore.FieldValue.arrayUnion(e.target.value)
        })
    }

    return (
        <div>
            <h1><u>Name: {gameInfo.data().name}</u></h1>
            <h1><u>Creator: {gameInfo.data().creator}</u></h1>
            
            <h3>Starting Amount: {gameInfo.data().starting_amount} USD</h3>
            <h3>Duration: {gameInfo.data().duration - 1} {gameInfo.data().duration - 1 === 1 ? `week`: `weeks`}</h3>
         
            <h3>Start date: {gameInfo.data().start_date}</h3>
            <h3>End date: {gameInfo.data().end_date}</h3>
                               
            <h3>Players: {gameInfo.data().player_count} / {gameInfo.data().max_players}</h3>

            {gameInfo.data().player_count < gameInfo.data().max_players ? (
                <button value={`${gameInfo.id}`} onClick={joinGameSession}>Join</button>
            ): (
                <p></p>
            )
            }
            {gameInfo.data().players ? (
                console.log(gameInfo.data().players),
                gameInfo.data().players.map((player) => (
                    <div>
                        <span>{Object.keys(player)[0]}</span>
                        <span>${player[Object.keys(player)[0]].cash} USD</span>
                    </div>
                ))
            ): (
                <p>No Players Found</p>
            )
            }
        </div>
    )
}

export default GameModal
