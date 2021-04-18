import React, { useState, useEffect } from 'react'
import "./FindGames.css"
import { db } from "../firebase"
import store from "../Redux/index"
import firebase from "firebase"
import GameModal from "../GameModal/GameModal"
import IconButton from '@material-ui/core/IconButton';
//import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';



function FindGames() {
    const [games, setGames] = useState([])
    const [filteredGame, setFilteredGame] = useState([])

    const [open, setOpen] = useState(false);
    const [modalGameInfo, setModalGameInfo] = useState(null)
    const [search, setSearch] = useState("");

    var gameArr = [];

    const handleClickOpen = (instance) => {
      setOpen(true)
      setModalGameInfo(instance)
    }
  
    const handleClose = () => {
      setOpen(false)
    }

    
    
    useEffect(() => { 
        let isMounted = true; // note this flag denote mount status

        db.collection('current_games').onSnapshot(snapshot => {          
            setGames(snapshot.docs.map(doc => doc))  
            //snapshot.docs.map(doc => gameNames.push(doc.data().name)) 
        })
        console.log("object")

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
        return () => { isMounted = false }; // use effect cleanup to set flag false
    }, [])
    
    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        setFilteredGame(
          games.filter((game) =>
            game.data().name.toLowerCase().includes(search.toLowerCase())
          )
        );
        return () => { isMounted = false }; // use effect cleanup to set flag false
      }, [search, games]);

    return (
        <div>
            <div className="searchbar">
                    <input
                        type="text"
                        placeholder="Search for a Game"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <i className="fas fa-search" id="searchGlass"></i>
                </div>
            <div id = "game-style">
                

                {filteredGame.length === 0 ? (
                    <p>No games found. Head over to "Create a Game" to create a new game session!</p>
                ) : (
                filteredGame.map((instance) => (
                    <div>
                        <div onClick={() => handleClickOpen(instance)} className="flip-card">
                            
                               
                                   
                                    <div id="spanner">
                                        <h2><u>{instance.data().name}</u></h2>
                                        <h3>Created By: {instance.data().creator}</h3>
                                    </div>
                                    <br />
                                    <div id="Midspanner">                                 
                                        <h3>{instance.data().player_count} / {instance.data().max_players} <br /> Players</h3>
                                    </div>
                                    <br />
                                    <div id="non-spanner">
                                        <h3>Starting Amount: {instance.data().starting_amount} USD</h3>
                                        <h3>Start date: {instance.data().start_date.substring(0,16)}</h3>
                                    </div>
                            
                                    {/* <div id="non-spanner">
                                        <h3>Start date: {instance.data().start_date}</h3>
                                        <h3>End date: {instance.data().end_date}</h3>
                                    </div> */}

                                    <div id="spanner">                                 
                                        <h3>Players: {instance.data().players.length} / {instance.data().max_players}</h3>
                                    </div>

                                    {/* <h3 id = "id" value = {`${instance.id}`}>{instance.id}</h3> */}
                                
                            
                        </div>
                    </div>      
                )))
                } 
            </div>  

            <Dialog style = {{maxWidth: "100%"}} fullScreen open = {open}>
                <Toolbar style = {{maxWidth: "90%"}}> 
                    <IconButton edge="start" color="black" onClick={handleClose} aria-label="close">
                        <p>Go Back </p>
                    </IconButton>
                </Toolbar>
                <GameModal gameInfo={modalGameInfo} />
            </Dialog> 
        </div>
    )
}

export default FindGames