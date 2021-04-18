import React, {useEffect, useState} from 'react'
import firebase from "firebase"
import { db } from "../firebase"
import store from "../Redux/index"
import "./GameModal.css"
import EditPortfolio, { ViewPortfolio } from "../Portfolio/Portfolio"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Profile from "../Profile/Profile"

function GameModal({ gameInfo }) {
    const [Portfolio, setPortfolio] = useState()
    const [players, setPlayers] = useState([])
    const [Tokens, setTokens] = useState([])

    useEffect(() => {
        gameInfo.data().players.forEach((player) => {setPlayers([...players, player])})
    }, [])

    function joinGameSession(e){
        e.preventDefault()
        if(!gameInfo.data()[store.getState().username]){
            db.collection("current_games").doc(e.target.value).update({
                player_count: firebase.firestore.FieldValue.increment(1),
                [store.getState().username]: {cash: Number(gameInfo.data().starting_amount), canEdit: true},
                players: firebase.firestore.FieldValue.arrayUnion( store.getState().username )
            })  
            db.collection("users").doc(store.getState().username).update({
                current_games: firebase.firestore.FieldValue.arrayUnion(e.target.value)
            })
            store.dispatch({     // store user info in global state 
                type: "UPDATE_GAMES",
                payload: {
                    MyGames: [...store.getState().username, e.target.value]        
                } 
            }) 
        }

        // if(players.indexOf(store.getState().email) === -1){
        //     db.collection("current_games").doc(e.target.value).update({
        //         player_count: firebase.firestore.FieldValue.increment(1),
        //         players: firebase.firestore.FieldValue.arrayUnion( {[store.getState().email]: {cash: gameInfo.data().starting_amount}} )  
        //     })
        //     db.collection("users").doc(`${store.getState().userInfo.email}`).update({
        //         current_games: firebase.firestore.FieldValue.arrayUnion(e.target.value)
        //     })
        // }
    }

    function displayEditPortfolio(username, portfolio){
        setPortfolio(<EditPortfolio username={username} gameId={gameInfo.id} portfolio={portfolio} />)
    }

    const [dailyCoinPrices, setDailyCoinPrices] = useState({})
    function displayViewPortfolio(username, portfolio){
        db.collection('coin_prices').onSnapshot(snapshot => {  
            snapshot.docs.map(doc => (
                //console.log(doc.id)
                //console.log(doc.data().value)
                //setAssets({...assets, [name]: Number(convertedPrice)}) 
                setDailyCoinPrices({...dailyCoinPrices, [doc.id] : Number(doc.data().value)})  
            )) 
        })     
   
        setTokens(
            Object.keys(portfolio).map((coin) => ( coin ))     
        )

        setTimeout(() => {}, 2000)

        console.log(Tokens)
        setPortfolio(<ViewPortfolio username={username} portfolio={portfolio} tokens={Tokens} />)
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
                    <button id="gameId" value={`${gameInfo.id}`} onClick={(e) => {joinGameSession(e)}}>Join</button> 
                </div>
            ): (
                <p></p>
            )
            }

            <div id="game-players">
                <h2>Current Players:</h2>
                {gameInfo.data().players ? (
                    console.log(gameInfo.data().mopatel1214),
                    gameInfo.data().players.map((player) => (
                        <div id="leaderboard">
                                                    
                            <span>{player}</span>
                           
                            <span id="portfolio-btns">
                                {store.getState().username === player && gameInfo.data()[player]["canEdit"] ? (
                                    <span>
                                        <span onClick={() => {displayEditPortfolio(player, gameInfo.data()[player])}} className="edit-portfolio-btn"><u>Edit Portfolio</u></span>
                                        <span onClick={() => {displayViewPortfolio(player, gameInfo.data()[player])}} className="view-portfolio-btn"><u>View Portfolio</u></span>
                                    </span>
                                    ) : (
                                        <span onClick={() => {displayViewPortfolio(player, gameInfo.data()[player])}} className="view-portfolio-btn"><u>View Portfolio</u></span>
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

            <div>{Portfolio}</div>
        </div>
      
    )
}

export default GameModal
