import React, { useEffect, useState } from 'react'
import "./MyGames.css"
import { db } from "../firebase"
import store from "../Redux/index"


function MyGames() {
    const [GameId, setGameId] = useState([])
    const [MyGames, setMyGames] = useState([])
    const [showGames, setShowGames] = useState([])

    useEffect(() => { 
        // db.collection('users').doc(store.getState().email).onSnapshot(snapshot => {
        //     //console.log(snapshot)
        //     //setGameId(snapshot.docs.map(doc => doc.data().current_games))   
        //     snapshot.docs.map(doc => console.log(doc.data()))
        //     findMyGamesInfo()
        // })
        db.collection('users').doc(store.getState().email).get().then((doc) => {
            if(doc.exists){
                setGameId(doc.data().current_games)
                console.log("Document data:", doc.data())
                findMyGamesInfo()  
            } 
            else{
                 console.log("No such document!")
            }
            }).catch((error) => {
                console.log("Error getting document:", error)
            })
    }, [])

    function findMyGamesInfo(){
        db.collection('current_games').onSnapshot(snapshot => {
            setMyGames(snapshot.docs.map(doc => doc.data().id))  
            snapshot.docs.map(doc => console.log(doc.data())) 
        })
        console.log(MyGames)
        for(let idx = 0; idx < GameId.length; idx++){
            if(MyGames.indexOf(GameId[idx].id) !== -1){
                console.log(GameId[idx].id)
                setShowGames([...showGames, MyGames[idx]])
            }
        }
        console.log(showGames)
    }

    return (
        <div>
            {showGames.map((instance) => (
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
