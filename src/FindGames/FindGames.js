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

import Select from "react-select";



function FindGames() {
    const [games, setGames] = useState([])
    const [filteredGame, setFilteredGame] = useState([])

    const [open, setOpen] = useState(false);
    const [modalGameInfo, setModalGameInfo] = useState(null)
    const [search, setSearch] = useState("");

    const [unfiltered, setUnfiltered] = useState([]) // testing
    const [isFiltered, setIsFiltered] = useState(false) // testing
    const [currentFilter, setCurrentFilter] = useState() // testing
    const filters = [
        { label: "Choose a Filter", value: 0 },
        { label: "Starting Cash (High to Low)", value: 1 },
        { label: "Starting Cash (Low to High)", value: 2 },
        { label: "Player Count (High to Low)", value: 3 },
        { label: "Player Count (Low to High)", value: 4 }
    ];


    const handleClickOpen = (instance) => {
      setOpen(true)
      setModalGameInfo(instance)
    }
  
    const handleClose = () => {
      setOpen(false)
    }
    
    useEffect(() => { 
        db.collection('joinable_games').onSnapshot(snapshot => {          
            setGames(snapshot.docs.map(doc => doc))  
        })
    }, [])
    
    useEffect(() => {
        setFilteredGame(
          games.filter((game) =>
            game.data().name.toLowerCase().includes(search.toLowerCase())
          )
        )
      }, [search, games]);

    const setFilter = e => {
        setCurrentFilter(e.value)
        var toSort = filteredGame.map((game) => {
            return game
        })
        if(!isFiltered){
            setUnfiltered(toSort);
            setIsFiltered(true)
        }
        //"Choose a Filter"
        if(e.value === 0){
            toSort = unfiltered.map((game) => {
                return game
            })
            setIsFiltered(false)
            console.log("filter")
        }
        //"Starting Cash (High to Low)"
        if(e.value === 1){
            toSort.sort((a,b) => b.data().starting_amount - a.data().starting_amount)
        }
        //"Starting Cash (Low to High)"
        if(e.value === 2){
            toSort.sort((a,b) => a.data().starting_amount - b.data().starting_amount)
        }
        //"Player Count (High to Low)"
        if(e.value === 3){
            toSort.sort((a,b) => b.data().player_count - a.data().player_count)
        }
        //"Player Count (Low to High)"
        if(e.value === 4){
            toSort.sort((a,b) => a.data().player_count - b.data().player_count)
        }
        setFilteredGame(toSort)
    }

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

            <div className = "filter-menu">
                <Select 
                    placeholder = "Choose a Filter" 
                    value={filters.filter(obj => obj.value === currentFilter)}
                    options={filters} 
                    onChange={setFilter}
                />
            </div>

            <div id = "game-style">
                {filteredGame.length === 0 ? (
                    <p style={{color: "white"}}>No new games found. Head over to "Create a Game" to create a new game session!</p>
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
                                <h3>Start date: {String(new Date(instance.data().start_date)).substring(0,16)}</h3>
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