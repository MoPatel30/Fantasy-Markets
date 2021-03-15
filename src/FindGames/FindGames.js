import React, { useState, useEffect } from 'react'
import "./FindGames.css"
import { db } from "../firebase"
import store from "../Redux/index"


function FindGames() {
    const [games, setGames] = useState([])
    // var docRef = db.collection("current_games")

    useEffect(() => {
        db.collection('current_games').onSnapshot(snapshot => {
            setGames(snapshot.docs.map(doc => doc))   
            snapshot.docs.map(doc => console.log(doc.id))   
        })

        // docRef.get().then((doc) => {
        //     if (doc.exists) {
        //         console.log("Document data:", doc.data());
        //     } else {
        //         // doc.data() will be undefined in this case
        //         console.log("No such document!");
        //     }
        // }).catch((error) => {
        //     console.log("Error getting document:", error);
        // });

        // db.collection("current_games").where("max_players", ">", "0")
        //     .get()
        //     .then((querySnapshot) => {
        //         querySnapshot.forEach((doc) => {
        //             // doc.data() is never undefined for query doc snapshots
        //             console.log(doc.id, " => ", doc.data());
        //             setGames([...games, doc.data()])
        //             console.log(games)
        //         });
        //     })
        //     .catch((error) => {
        //         console.log("Error getting documents: ", error);
        //     });

        // db.collection("current_games")
        //     .onSnapshot()
        //     .then((doc) => {
        //         console.log("Current data: ", doc.data());
        //         setGames([doc.data()])
        //     })
        //     .catch((err) => {
        //         console.log("Error: ", err)
        //     })
    }, [])

    function joinGameSession(id, name){
        // db.collection("current_games").doc(`${id}`).update({
        //    [name]: {cash: "6696"}})
    }

    return (
        <div>
            <h1>Join a Game Session</h1>
            {games.map((instance) => (
                <div className="game-style">
                    <h1>Name: {instance.data().name}</h1>
                    <h1>creator: {instance.data().creator}</h1>
                    
                    <h2>Players: 1 / {instance.data().max_players}</h2>
                    <h2>Starting Amount: {instance.data().starting_amount}</h2>
            
                    <h3>Duration: {instance.data().duration - 1} weeks</h3>
                    <h3>Start date: {instance.data().start_date}</h3>
                    <h3>End date: {instance.data().end_date}</h3>
                    <h3>{instance.id}</h3>
                    {1 < instance.data().max_players ? (
                        <button onClick={joinGameSession(instance.id, store.getState().userInfo.email)}>Join</button>
                    ): (
                        <p></p>
                    )
                    }

                </div>
            ))
            }        
        </div>
    )
}

export default FindGames
