import React, { useState, useEffect } from 'react'
import "./FindGames.css"
import { db } from "../firebase"


function FindGames() {
    const [games, setGames] = useState([])
    // var docRef = db.collection("current_games")

    useEffect(() => {
        db.collection('current_games').onSnapshot(snapshot => {
            setGames(snapshot.docs.map(doc => doc.data()))      
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

    return (
        <div>
            <h1>Join a Game Session</h1>
            {games.map((instance) => (
                <div className="game-style">
                    <h1>Name: {instance.name}</h1>
                    <h1>creator: {instance.creator}</h1>
                    
                    <h2>Players: 1 / {instance.max_players}</h2>
                    <h2>Starting Amount: {instance.starting_amount}</h2>
            
                    <h3>Duration: {instance.duration - 1} weeks</h3>
                    <h3>Start date: {instance.start_date}</h3>
                    <h3>End date: {instance.end_date}</h3>
                </div>
            ))
            }        
        </div>
    )
}

export default FindGames
