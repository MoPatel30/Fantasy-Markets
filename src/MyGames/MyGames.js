import React, { useEffect, useState } from 'react'
import "./MyGames.css"
import { db } from "../firebase"
import store from "../Redux/index"


function MyGames() {
    const [MyGameIds, setMyGameIds] = useState([])
    const [CurrentGames, setCurrentGames] = useState([])
    const [showGames, setShowGames] = useState([])

    async function getMyGames(){
        await db.collection('users').doc(store.getState().email).get().then((doc) => {
            if(doc.exists){
                setMyGameIds(doc.data().current_games)
                console.log("Document data:", doc.data()) 
                console.log(MyGameIds) 
            } 
            else{
                 console.log("No such document!")
            }
            }).catch((error) => {
                console.log("Error getting document:", error)
            })
    }

    useEffect(() => { 
        getMyGames().then(() => {
            console.log(MyGameIds)
            if(MyGameIds.length > 0){
                db.collection("current_games")
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            if(MyGameIds.indexOf(doc.id) !== -1){
                                console.log(doc.id)
                                let temp = showGames
                                temp.push(doc)
                                setShowGames(temp)
                            }
                        })
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error)
                    })  
            }
            else{
                console.log("fuck")
            }
        })
            // if(isMounted){
            //     findMyGamesInfo()
            // }
        
        //return () => {isMounted = false}
       
        // })
        // db.collection('users').doc(store.getState().email).get().then((doc) => {
        //     if(doc.exists){
        //         setMyGameIds(doc.data().current_games)
        //         console.log("Document data:", doc.data())
        //         db.collection("current_games")
        //             .get()
        //             .then((querySnapshot) => {
        //                 querySnapshot.forEach((doc) => {
        //                     setCurrentGames(...CurrentGames, doc)
        //                     console.log(doc.id, " => ", doc.data())
        //                 })
        //             })
        //             .catch((error) => {
        //                 console.log("Error getting documents: ", error)
        //             })  
        //     } 
        //     else{
        //          console.log("No such document!")
        //     }
        //     }).catch((error) => {
        //         console.log("Error getting document:", error)
        //     })
    }, [])

    function findMyGamesInfo(){
        console.log(MyGameIds)
        CurrentGames.forEach((doc) => {
            if(MyGameIds.indexOf(doc.id) !== -1){
                console.log(doc.id)
                setShowGames([...showGames, doc])
            }
        })
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
