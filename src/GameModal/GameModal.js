import React, {useEffect, useState} from 'react'
import firebase from "firebase"
import { db } from "../firebase"
import store from "../Redux/index"
import "./GameModal.css"
import EditPortfolio, { ViewPortfolio } from "../Portfolio/Portfolio"
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';



function GameModal({ gameInfo }) {
    const [Portfolio, setPortfolio] = useState()
    const [players, setPlayers] = useState([])
    const [leaderboard, setLeaderboard] = useState([])
    const [Tokens, setTokens] = useState([])
    const [view, setView] = useState(false)
    const [editPort, setEditPort] = useState(false)
    const [currentTime, setCurrentTime] = useState(Math.round(new Date().getTime()))
    const [days, setDays] = useState("")
    const [hours, setHours] = useState("23")
    const [minutes, setMinutes] = useState("59")
    const [seconds, setSeconds] = useState("59")

    useEffect(() => {
        gameInfo.data().players.forEach((player) => {
            console.log(player)
            console.log(gameInfo.data()[player].total)
            setLeaderboard( [...leaderboard, {[player] : gameInfo.data()[player].total}] )
        })
        setPlayers(gameInfo.data().players)
        //setPlayers(mergeSort(players))
    }, [])

    function mergeSort(array) { 
        console.log(array)
        console.log(leaderboard)
        const half = array.length / 2    
        // Base case or terminating case
        if(array.length < 2){
            return array 
        }   
        const left = array.splice(0, half)
        return merge(mergeSort(left), mergeSort(array))
    }

    function merge(left, right) {
        let arr = []
        // Break out of loop if any one of the array gets empty
        while (left.length && right.length) {
            // Pick the smaller among the smallest element of left and right sub arrays 
            if (leaderboard[left[0]] < leaderboard[right[0]]) {
                arr.push(left.shift())  
            } else {
                arr.push(right.shift()) 
            }
        }     
        // Concatenating the leftover elements
        // (in case we didn't go through the entire left or right array)
        return [ ...arr, ...left, ...right ]
    }
    
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
            store.dispatch({ // store user info in global state 
                type: "UPDATE_GAMES",
                payload: {
                    MyGames: [...store.getState().username, e.target.value]        
                } 
            }) 
        }
    }

    function displayEditPortfolio(username, portfolio){
        setEditPort(true)
        setPortfolio(<EditPortfolio username={username} gameId={gameInfo.id} portfolio={portfolio} />)
    }

    const [dailyCoinPrices, setDailyCoinPrices] = useState({})
    function displayViewPortfolio(username, portfolio){
        db.collection('coin_prices').onSnapshot(snapshot => {  
            snapshot.docs.map(doc => (
                setDailyCoinPrices({...dailyCoinPrices, [doc.id] : Number(doc.data().value)})  
            )) 
        })     
   
        setTokens(
            Object.keys(portfolio).map((coin) => ( coin ))     
        )

        setTimeout(() => {}, 2000)

        console.log(Tokens)
        setView(true)
        setPortfolio(<ViewPortfolio username={username} portfolio={portfolio} tokens={Tokens} />)
    }

    const viewClose = () => {
        setView(false);
    }

    const editPortClose = () => {
        setEditPort(false);
    }

    useEffect(() => {
        let startTime = gameInfo.data().start_date
        let endTime = gameInfo.data().end_date
        if(startTime > currentTime){
            setCurrentTime(Math.round(new Date().getTime()))
      
            let timer = (startTime - currentTime) / 1000

            let d = Math.floor(timer / 86400)
            let h = Math.floor(timer / 3600)
            let m = Math.floor(timer % 3600 / 60)
            let s = Math.floor(timer % 3600 % 60)  

            setDays(d > 0 ? d + (d === 1 ? " day" : " days") : "")
            setHours(h > 0 ? h + (h === 1 ? " hour" : " hours") : "")
            setMinutes(m > 0 ? m + (m === 1 ? " minute" : " minutes") : "")
            setSeconds(s > 0 ? s + (s === 1 ? " second" : " seconds") : "")
        }
        else {
            setCurrentTime(Math.round(new Date().getTime()))

            let timer = (endTime - currentTime) / 1000

            let d = Math.floor(timer / 86400)
            let h = Math.floor(timer % 86400 / 3600)
            let m = Math.floor(timer % 86400 % 3600 / 60)
            let s = Math.floor(timer % 86400 % 3600 % 60)
        
            setDays(d > 0 ? d + (d === 1 ? " day" : " days") : "")
            setHours(h > 0 ? h + (h === 1 ? " hour" : " hours") : "")
            setMinutes(m > 0 ? m + (m === 1 ? " minute" : " minutes") : "")
            setSeconds(s > 0 ? s + (s === 1 ? " second" : " seconds") : "")
        }
    }, [])
   

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
                    <h3>Start date:<br/>{String(new Date(gameInfo.data().start_date)).substring(0,16)}</h3>
                    <br/>
                    <h3>End date: <br/>{String(new Date(gameInfo.data().end_date)).substring(0,16)}</h3>
                    <br />
                    {days !== "" ? (
                        <h3>Countdown: {days}: {hours}: {minutes}: {seconds}</h3>
                    ) : (
                        <h3>Countdown: {hours}: {minutes}: {seconds}</h3>
                    )}
                </div>
            </div>
         
            {gameInfo.data().players.indexOf(store.getState().username) === -1 && gameInfo.data().player_count < gameInfo.data().max_players ? (
                <div>
                    <button id="gameId" value={`${gameInfo.id}`} onClick={(e) => {joinGameSession(e)}}>Enter Game</button> 
                </div>
            ): (
                <p></p>
            )
            }

            <div id="game-players">
                {new Date().getTime() > gameInfo.data().start_date ? (
                    <h2>Leaderboard</h2>
                ) : (
                    <h2>Current Players:</h2>
                )
                }
                {players ? (
                    console.log(players),
                    mergeSort(players).map((player) => (
                        <div id="leaderboard">
                            <span> {gameInfo.data().players.indexOf(player) + 1}.) </span>                 
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
