import React, {useState, useEffect} from 'react'
import Crypto from "../Crypto/Crypto"
import "./Portfolio.css"
import { connect } from 'react-redux'
import { db } from "../firebase"
import firebase from "firebase"
import store from ".././Redux/index"
import {auth, provider} from "../firebase.js"


function Portfolio({username,gameId}) {
    const [amount, setAmount] = useState(10000)
    const [assets, setAssets] = useState({})
    const [coinName, setCoinName] = useState("")
    const [coinAmount, setCoinAmount] = useState(0)
    const [numberOfCoins, setNumberOfCoins] = useState(5)

    
/* 
    useEffect(() => {
        db.collection('current_games').onSnapshot(snapshot => {
             
            snapshot.docs.map(doc => doc.data()
            .players.map(player => 
                console.log(player[Object.keys(player)[0]])
                )
                
            )
            
        })
    }, []) */
    
    
    
    
    
    
    function addCoin(e){
        if(amount - coinAmount < 0){
            alert("Not enough funds remaining")
        }
        if(numberOfCoins <= 0){
            alert("You are only allowed a maximum of 5 coins. Please rebalance your portfolio if you wish to use your remaining cash.")
        }
        else{
            let name = coinName

            setAssets({...assets, [name]: coinAmount}) 
           
            setAmount(amount - coinAmount)
            setNumberOfCoins(numberOfCoins - 1)

            //need to fix .doc(need current game id here) only have temp game id rn
            //Want each player to have their own asset/portfolio per game

            /* db.collection("current_games").doc(gameId).update({
                players: firebase.firestore.FieldValue.arrayUnion( { 
                    [store.getState().email]: {
                        Coins: {[name]: coinAmount}
                        
                    }
                })  
            }) */


          
            setCoinName("")
            setCoinAmount(0)



            

        }
    }


    return (
        <div className = "portfolio">           
            <h1><u className = "title">{username}'s Portfolio</u></h1>

            <div className = "add-coin">
                <p>Coins remaining: {numberOfCoins} </p>
                <p>Funds remaining: {amount}</p>

                <input type = "text" placeholder = "Full coin name"  onChange = {(e) => setCoinName(e.target.value.toLowerCase())}></input>
                <input type = "number" placeholder = "Amount in USD" onChange = {(e) => setCoinAmount(e.target.value)}></input>
                <button type = "submit" onClick = {addCoin}> Add coin </button>
            </div>

            <Crypto portfolio = {assets} />   
        </div>
    )
}

const mapStateToProps = (state) => ({
    username: state.username,
    userInfo: state.userInfo
})


export default (connect)(mapStateToProps)(Portfolio)