import React from 'react'
import "./CreateGame.css";
import { db } from "../firebase"
import store from ".././Redux/index"
import firebase from "firebase"


function CreateGame() {
    const docRef = db.collection("joinable_games")
    const create = store.getState().username
    const userRef = db.collection("users")

    function createGame(e){
        e.preventDefault()

        const formData = new FormData(document.querySelector('form'))
        let data = []
        for (var pair of formData.entries()) {
            data.push(pair[1])
            console.log(pair[0] + ': ' + pair[1])
        }

        let time = 1209600000
        if(data[2] === "1"){
            time = 1209600000 / 2
        } else{
            time = 1209600000
        } 
       
        docRef.add({
            name: data[0].substring(0, 24),
            creator: create,
            duration: Number(data[2]),
            starting_amount: data[1],
            start_date: Math.round(new Date().getTime()) + 86400000,
            end_date: Math.round(new Date().getTime()) + time,
            max_players: data[3],
            player_count: 1,
            [create]: {"cash": Number(data[1]), "canEdit": true, "total": Number(data[1])},
            players: [create]
        })
        .then((doc) => {
            console.log("Document successfully written!", doc.id)
            userRef.doc(create).update({
               current_games: firebase.firestore.FieldValue.arrayUnion(doc.id)
           })
        })
        .catch((error) => {
            console.error("Error writing document: ", error)
        })
    }

    return (
        <div className="form-style-5">
           <form id = "form">
                <fieldset>
                    <legend><span class="number">$</span> Create A Game!</legend>
                    <input id="name" type="text" name="field1" placeholder="Name of Game" />
                    <input id="starting-amount" type="number" name="field2" placeholder="Starting Amount of USD" />
                    
                    <label for="job">Duration of Game:</label>
                    <select id="job" name="field3">

                    <optgroup id="duration" label="Weeks">
                        <option value="1">1 Weeks</option>
                        <option value="2">2 Weeks</option>
                    </optgroup>

                    </select>    
                    <label for="job">Number of Investors:</label>

                    <select id="max-players" name="field4">
                        <optgroup label="Investors">
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </optgroup>
                    </select>      
                </fieldset>
                <button onClick={(e) => createGame(e)}> Start Game </button>
            </form>
        </div>
    )
}

export default CreateGame