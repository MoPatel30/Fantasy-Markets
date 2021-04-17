import React, {useEffect, useState} from 'react'
import firebase from "firebase"
import { db } from "../firebase"
import store from "../Redux/index"
import "./GameModal.css"
import EditPortfolio, { ViewPortfolio } from "../Portfolio/Portfolio"
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

function GameModal({ gameInfo }) {
    const [Portfolio, setPortfolio] = useState()
    const [players, setPlayers] = useState([])
    const [Tokens, setTokens] = useState([])
    const [view,setView] = useState(false);
    const [editPort,setEditPort] = useState(false);

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
        setEditPort(true);
        setPortfolio(<EditPortfolio username={username} gameId={gameInfo.id} portfolio={portfolio} />)
    }

    function displayViewPortfolio(username, portfolio){
        setView(true);
        setTokens(
            Object.keys(portfolio).map((coin) => ( coin ))     
        )

        setTimeout(() => {}, 2000)

        console.log(Tokens)
        setPortfolio(<ViewPortfolio username={username} portfolio={portfolio} tokens={Tokens} />)
    }
    const viewClose = () => {
        setView(false);
    }
    const editPortClose = () => {
        setEditPort(false);
    }

    return (
        <div>
            <div id="game-info">
                <div id="game-name-creator">
                    <h1><u>{gameInfo.data().name}</u></h1>
                    <h3>Created by {gameInfo.data().creator}</h3>
                </div>
        
                <div className = "game-information">
                    <h2><u>Game Information:</u></h2>
                    <h3>Starting Amount: {gameInfo.data().starting_amount} USD</h3>
                    <br/>
                    <br/>
                    <h3 id= "number">{gameInfo.data().player_count} / {gameInfo.data().max_players} <br /> Players</h3>
                    <br/>
                    <br />

                    <h3>Duration: {gameInfo.data().duration - 1} {gameInfo.data().duration - 1 === 1 ? `week`: `weeks`}</h3>
                    <br/>
                    <h3>Start date:<br/>{gameInfo.data().start_date.substring(0,16)}</h3>
                    <br/>
                    <h3>End date: <br/>{gameInfo.data().end_date.substring(0,16)}</h3>
                                    
                    
                </div>
            </div>
         
            {gameInfo.data().player_count < gameInfo.data().max_players ? (
                <div>
                    <button id="gameId" value={`${gameInfo.id}`} onClick={(e) => {joinGameSession(e)}}>Enter Game</button> 
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

            <div className = "rules">
                <h1>General Rules</h1>
                <h3>1.) Rule #1</h3>
                <h3>2.) Rule #2</h3>
                <h3>3.) Rule #3</h3>
                <h3>4.) Rule #4</h3>
                <h3>5.) Rule #5</h3>
            </div>

            {/* The Modal for Viewing your Portfolio */}
            <Dialog fullWidth maxWidth={'sm'} open = {view}>
                <IconButton edge="start" color="black" onClick={viewClose} aria-label="close">
                    <p>Close</p>
                </IconButton>
                <div>{Portfolio}</div>
            </Dialog>

                {/* The Modal for Creating Your Portfolio */}
            <Dialog fullWidth maxWidth={'md'} open = {editPort}>
                <IconButton edge="start" color="black" onClick={editPortClose} aria-label="close">
                    <p>Close</p>
                </IconButton>
                <div>{Portfolio}</div>
            </Dialog>
        </div>
    )
}

export default GameModal
