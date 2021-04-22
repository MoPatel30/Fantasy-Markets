import React, { useEffect, useState } from 'react'
import "./MyGames.css"
import { db } from "../firebase"
import store from "../Redux/index"
import GameModal from "../GameModal/GameModal"
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import firebase from "firebase"


function MyGames() {
    const [MyGameIds, setMyGameIds] = useState(store.getState().MyGames)
    const [showGames, setShowGames] = useState([])
    const [currentGames, setCurrentGames] = useState([])
    const [open, setOpen] = useState(false);
    const [modalGameInfo, setModalGameInfo] = useState(null)
    const [search, setSearch] = useState("");
    const [filteredGame, setFilteredGame] = useState([])


    const handleClickOpen = (instance) => {
      setOpen(true)
      setModalGameInfo(instance)
    }
  
    const handleClose = () => {
      setOpen(false)
    }

    function getGames() {
        db.collection('current_games').onSnapshot(snapshot => {          
            setShowGames(snapshot.docs.map(doc => doc))         
        }) 
    }

    useEffect(() => { 
        getGames()
    }, [])

    useEffect(() => {    
        setFilteredGame(
            showGames.filter(game => MyGameIds.indexOf(game.id) !== -1).filter((game) =>
            game.data().name.toLowerCase().includes(search.toLowerCase())
          )
        )
    }, [search, showGames]);

    return (
        <div>
        <div id = "game-style">
            <div className="searchbar">
                <input
                    type="text"
                    placeholder="Search for a Game"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <i className="fas fa-search" id="searchGlass"></i>
            </div>

            {filteredGame.length === 0 ? (
                <p>Head over to "Find Games" to join an upcoming game session!</p>
            ) : (
            filteredGame.map((instance) => (
                <div>
                    <div onClick={() => handleClickOpen(instance)} className="flip-card">
                        <div className="flip-card-inner">
                            <div className="flip-card-front">
                               
                                <div id="spanner">
                                    <h2><u>{instance.data().name}</u></h2>
                                </div>

                                <div id="non-spanner">
                                    <h3>Starting Amount: {instance.data().starting_amount} USD</h3>
                                    <h3>Duration: {instance.data().duration - 1} {instance.data().duration - 1 === 1 ? `week`: `weeks`}</h3>
                                    <h3>Start date:  {String(new Date(instance.data().end_date)).substring(0,16)}</h3>
                                </div>
                        
                                {/* <div id="non-spanner">
                                    <h3>Start date: {instance.data().start_date}</h3>
                                    <h3>End date: {instance.data().end_date}</h3>
                                </div> */}

                                <div id="spanner">                                 
                                    <h3>Players: {instance.data().player_count} / {instance.data().max_players}</h3>
                                </div>

                                {/* <h3 id = "id" value = {`${instance.id}`}>{instance.id}</h3> */}
                            </div>
                        </div>
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


export default MyGames
