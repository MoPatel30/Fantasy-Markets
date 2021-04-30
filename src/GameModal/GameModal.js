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
    }, [])
    
    function joinGameSession(e){
        e.preventDefault()
        if(gameInfo.data()["players"].indexOf(store.getState().username) === -1){
            db.collection("joinable_games").doc(String(e.target.value)).update({
                [store.getState().username]: {cash: Number(gameInfo.data().starting_amount), canEdit: true, total: Number(gameInfo.data().starting_amount)},
                players: firebase.firestore.FieldValue.arrayUnion( store.getState().username )
            })  
            db.collection("users").doc(store.getState().username).update({
                current_games: firebase.firestore.FieldValue.arrayUnion(e.target.value)
            })
            let new_state_games = store.getState().MyGames
            new_state_games.push(e.target.value)
            store.dispatch({ // store user info in global state 
                type: "ADD_POST",
                payload: {         
                    username: store.getState().username,
                    email: store.getState().email,
                    userInfo: store.getState().userInfo,
                    MyGames: new_state_games       
                } 
            }) 
        }
    }

    function displayEditPortfolio(username, portfolio){
        setEditPort(true)
        setPortfolio(<EditPortfolio username={username} gameId={gameInfo.id} portfolio={portfolio} />)
    }

    const [coinNames, setCoinNames] = useState([])
    const [dailyCoinPrices, setDailyCoinPrices] = useState([])
    async function getMarkers() {
        const prices = await firebase.firestore().collection('coin_prices')
        prices.get().then((querySnapshot) => {
            setDailyCoinPrices(querySnapshot.docs.map(doc => doc.data().value)) 
            setCoinNames(querySnapshot.docs.map(doc => doc.id))   
          }) 
      }
    useEffect(() => {
       getMarkers()   
    }, [])

    function displayViewPortfolio(username, portfolio, ranking){  
        setTokens(
            Object.keys(portfolio).map((coin) => ( coin ))     
        )

        setTimeout(() => {}, 3000)

        setView(true)
        setPortfolio(<ViewPortfolio dailyCoinPrices={dailyCoinPrices} coinNames={coinNames} username={username} portfolio={portfolio} tokens={Tokens} rank={ranking} />)
    }

    const viewClose = () => {
        setView(false)
    }

    const editPortClose = () => {
        setEditPort(false)
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
        <div id = "info">
            <div id="game-info">
                <div className = "game-information">
                    <h2><u>Game Information:</u></h2>
                    <br />
                    <h3 id= "number">{gameInfo.data().players.length} / {gameInfo.data().max_players} <br /> Players</h3>
                    <br />  

                    <h3>Starting Amount: {gameInfo.data().starting_amount} USD</h3>  
                    <h3>Duration: {gameInfo.data().duration} {gameInfo.data().duration === 1 ? `week`: `weeks`}</h3>
                    <br />

                    <h3>Start date:<br/>{String(new Date(gameInfo.data().start_date)).substring(0,16)}</h3>
                    <br /> 
                    <h3>End date: <br/>{String(new Date(gameInfo.data().end_date)).substring(0,16)}</h3>
                    <br />

                    {days !== "" ? (
                        <div>
                            <h3>Countdown:</h3>
                            <h3>{days}</h3>
                            <h3>{hours}</h3>
                            <h3>{minutes}</h3>
                            <h3>{seconds}</h3>
                        </div>
                    ) : new Date().getTime() > gameInfo.data().end_date ? (
                        <div>
                            <h3>Countdown:</h3>
                            <p><strong style={{color: "red"}}>This game session is over.</strong></p>
                        </div>
                    ) : (
                        <div>
                            <h3>Countdown:</h3>
                            <h3>{hours}</h3>
                            <h3>{minutes}</h3>
                            <h3>{seconds}</h3>
                        </div>
                    )}

                    {gameInfo.data().players.indexOf(store.getState().username) === -1 && gameInfo.data().players.length < gameInfo.data().max_players ? (
                        <div>
                            <button id="gameId" value={`${gameInfo.id}`} onClick={(e) => {joinGameSession(e)}}>Enter Game</button> 
                        </div>
                    ): (
                        <p></p>
                    )
                    }
                </div>
            </div>

            <div id="game-players">
                <div id="game-name-creator">
                    <h1><u>{gameInfo.data().name}</u></h1>
                    <h3>Created by {gameInfo.data().creator}</h3>
                </div>
        
                {new Date().getTime() > gameInfo.data().start_date ? (
                    <h2>Leaderboard</h2>
                ) : (
                    <h2>Current Players:</h2>
                )
                }
                {players ? (
                    players.map((player) => (
                        <div id="leaderboard">
                            {gameInfo.data().players.indexOf(player) + 1 === 1 ? (
                                <span>
                                    <span><img src="https://img.icons8.com/offices/20/000000/medal2.png"/></span>
                                    <span style={{color: "goldenrod", marginLeft: "5px"}}> {gameInfo.data().players.indexOf(player) + 1}st Place: </span>
                                </span>
                            ) : gameInfo.data().players.indexOf(player) + 1 === 2 ? (
                                <span>
                                    <span><img src="https://img.icons8.com/officel/20/000000/medal-second-place.png"/></span>
                                    <span style={{color: "silver", marginLeft: "5px"}}> {gameInfo.data().players.indexOf(player) + 1}nd Place: </span>
                                </span>
                            ) : gameInfo.data().players.indexOf(player) + 1 === 3 ? (
                                <span>
                                    <span><img src="https://img.icons8.com/officel/20/000000/medal2-third-place.png"/></span>
                                    <span style={{color: "brown", marginLeft: "5px"}}> {gameInfo.data().players.indexOf(player) + 1}rd Place: </span>
                                </span>
                            ) : (
                                <span style={{color: "black", marginLeft: "5px"}}> {gameInfo.data().players.indexOf(player) + 1}th Place: </span>
                            )
                            }               
                            <span><strong>{player}</strong></span>
                           
                            <span id="portfolio-btns">
                                {store.getState().username === player && gameInfo.data()[player]["canEdit"]  && new Date().getTime() < gameInfo.data().start_date ? (
                                    <span>
                                        <span onClick={() => {displayEditPortfolio(player, gameInfo.data()[player])}} className="edit-portfolio-btn"><u>Edit Portfolio</u></span>
                                        <span onClick={() => {displayViewPortfolio(player, gameInfo.data()[player], gameInfo.data().players.indexOf(player) + 1)}} className="view-portfolio-btn"><u>View Portfolio</u></span>
                                    </span>
                                    ) : (
                                        <span onClick={() => {displayViewPortfolio(player, gameInfo.data()[player], gameInfo.data().players.indexOf(player) + 1)}} className="view-portfolio-btn"><u>View Portfolio</u></span>
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
                <h1><u>General Rules</u></h1>
                <h3>1.) Don't refer to other user's portfolios as a means to make real life financial investments. Not that any of you would...</h3>
                <h3>2.) Don't try to exploit any bugs you come across. Have some integrity. Reach out to us explaining the bug.</h3>
                <h3>3.) You only get to finalize your portfolio once. Do your research, correctly input your investments, and hit "Submit". </h3>
                <h3>4.) To reiterate, do NOT make any real life financial decisions based on the results/outcomes of these games. Seriously...</h3>
                <h3>5.) Relax and have fun with it :)</h3>
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
