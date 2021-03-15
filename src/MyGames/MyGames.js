import React, { useEffect, useState } from 'react'
import "./MyGames.css"
import { db } from "../firebase"
import store from "../Redux/index"


function MyGames() {
    const [GameId, setGameId] = useState([])
    const [MyGames, setMyGames] = useState([])

    useEffect(() => {
        console.log(store.getState().email)
    
        db.collection('users').doc(store.getState().email).onSnapshot(snapshot => {
            setGameId(snapshot.docs.map(doc => doc.data().current_games))   
            snapshot.docs.map(doc => console.log(doc.data()))
            findMyGamesInfo()
        })
        
    }, [])

    function findMyGamesInfo(){
        console.log(GameId)
        db.collection('current_games').onSnapshot(snapshot => {
            snapshot.docs.map(doc => setMyGames([...MyGames, doc.id]))   
        })
    }

    return (
        <div>
            {MyGames.map((instance) => (
                <div className="game-style">
                    <h1>Name: {instance.data().name}</h1>
                    <h1>creator: {instance.data().creator}</h1>
                    
                    <h2>Players: 1 / {instance.data().max_players}</h2>
                    <h2>Starting Amount: {instance.data().starting_amount}</h2>
            
                    <h3>Duration: {instance.data().duration - 1} weeks</h3>
                    <h3>Start date: {instance.data().start_date}</h3>
                    <h3>End date: {instance.data().end_date}</h3>
                    <h3>{instance.id}</h3>
                </div>
            ))
         }     
        </div>
    )
}


export default MyGames
