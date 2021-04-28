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
import { partition } from 'd3'


function FindGames() {
    const [games, setGames] = useState([])
    const [filteredGame, setFilteredGame] = useState([])

    const [open, setOpen] = useState(false);
    const [modalGameInfo, setModalGameInfo] = useState(null)
    const [search, setSearch] = useState("");

    const [unfiltered, setUnfiltered] = useState([]) // testing
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

        setUnfiltered(filteredGame)

      }, [search, games]);

    const quicksort = (array, l, h, filter) => {

        var p

        if((h - l) > 0){
            p = split(array, l, h, filter)
            quicksort(array, l, p-1, filter)
            quicksort(array, p+1, h, filter)
        }

        if(filter === 1 || filter === 3){
            return (array.reverse())
        }
        return (array)
    }

    const split = (array, l, h, filter) => {
        var p = h
        var initialHigh = l

        for(var i = l; i < h; i++){
            if(filter === 1 || filter === 2){
                if(array[i].data().starting_amount < array[p].data().starting_amount){
                    [array[i], array[initialHigh]] = [array[initialHigh], array[i]]
                    initialHigh++
                }
            }
            if(filter === 3 || filter === 4){
                if(array[i].data().players.length < array[p].data().players.length){
                    [array[i], array[initialHigh]] = [array[initialHigh], array[i]]
                    initialHigh++
                }
            }
        }

        [array[p], array[initialHigh]] = [array[initialHigh], array[p]]

        return (initialHigh)
    }

    const setFilter = e => {

        setCurrentFilter(e.value)
        
        //"Choose a Filter"
        if(e.value === 0){
            setFilteredGame(unfiltered)
        }
        // Filters based on option
        if(e.value !== 0){
            setFilteredGame(quicksort(filteredGame, 0, filteredGame.length - 1, e.value))
        }
    }

    return (
        <div>
            <div className="search-filter-pos">
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
                                <br />
                                <hr style={{width: "100%"}} />
                            </div>
                            <br />
                            <div id="Midspanner">                                 
                                <h3>{instance.data().players.length} / {instance.data().max_players} <br /> Players</h3>
                            </div>
                            <br />
                            <hr style={{width: "100%"}} />
                            <br />
                            <div id="non-spanner">
                                <h3>Starting Amount: {instance.data().starting_amount} USD</h3>
                                <h3>Start date: {String(new Date(instance.data().start_date)).substring(0,16)}</h3>
                            </div>

                            <div id="spanner">                                 
                                <h3>Players: {instance.data().players.length} / {instance.data().max_players}</h3>
                            </div>     
                        </div>
                    </div>      
                )))
                } 
            </div>  

            <Dialog style = {{maxWidth: "100%"}} fullScreen open = {open}>
                <Toolbar style = {{maxWidth: "90%"}}> 
                    <IconButton edge="start" color="black" onClick={handleClose} aria-label="close">
                        <p> Close </p>
                    </IconButton>
                </Toolbar>
                <GameModal gameInfo={modalGameInfo} />
            </Dialog> 
        </div>
    )
}

export default FindGames