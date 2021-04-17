import React, {useState, useEffect} from 'react'
import Crypto from "../Crypto/Crypto"
import "./Portfolio.css"
import { connect } from 'react-redux'
import { db } from "../firebase"
import firebase from "firebase"
import store from ".././Redux/index"
import {auth, provider} from "../firebase.js"
const rp = require('request-promise');


function EditPortfolio({username, gameId, portfolio}) {
    const [amount, setAmount] = useState(10000)
    const [assets, setAssets] = useState({})
    const [coinName, setCoinName] = useState("")
    const [coinAmount, setCoinAmount] = useState(0)
    const [numberOfCoins, setNumberOfCoins] = useState(5)
    const [price, setPrice] = useState(1)
    const [currentCoinAmount, setCurrentCoinAmount] = useState(1)
    const [cash, setCash] = useState(Number(portfolio["cash"]))


    function getCoinInfo(currency, amount){
        const requestOptions = {
            method: 'GET',
            uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
            qs: {
              'slug': currency,
            },
            
            headers: {
              'X-CMC_PRO_API_KEY': "1d62807d-b858-4715-9a04-5fdfb1414cb0"
            },
            json: true,
            gzip: true
          };
           
          rp(requestOptions).then(response => {
            console.log('API call response:', response)
            setPrice(response.data[Object.keys(response.data)[0]].quote.USD.price)
            //setPrices([...prices, price])
            console.log(Number(amount) / price)
            setCurrentCoinAmount(Math.round((Number(amount) / price) * 10000) / 10000)
          }).catch((err) => {
            console.log('API call error:', err.message)
            setCurrentCoinAmount(1)
          })
          return currentCoinAmount
    }
    
    function addCoin(e){
        if(cash - coinAmount < 0){
            alert("Not enough funds remaining")
        }
        if(Object.keys(assets).length >= 6){
            alert("You are only allowed a maximum of 5 coins. Please rebalance your portfolio if you wish to use your remaining cash.")
        }
        else{
            let name = coinName
            setAssets({...assets, [name]: Number(coinAmount)}) 
            setCash(cash - Number(coinAmount))
            setCoinName("")
            setCoinAmount(0)            
        }
    }

    function submitPortfolio(){
        assets["cash"] = cash
        assets["canEdit"] = false
        db.collection("current_games").doc(gameId).set({[store.getState().username]: assets}, {merge : true})
    }

    return (
        <div className = "portfolio">           
            <h1><u className = "title">Finalize Your Portfolio</u></h1>
            <div className = "add-coin">
                <p>Coins remaining: {5 - Object.keys(assets).length} </p>
                <p>Funds remaining: {cash}</p>
                <button className= "addCoinBtn" type = "submit" onClick = {addCoin}> Add Coin </button>
            </div>
            <div className="inputFields">
                    <input type = "text" placeholder = "Full coin name(e.g. bitcoin)"  onChange = {(e) => setCoinName(e.target.value.toLowerCase())}></input>
                    <input type = "number" placeholder = "Amount in USD" onChange = {(e) => setCoinAmount(e.target.value)}></input>
                    
                </div>

            {/* <Crypto portfolio = {assets} />   */}

            {Object.keys(assets).map(currency => (
                <div>
                    <div className = "coin-info">
                        <p className="item">Name: {currency}</p>
                        <p className="item">Amount Invested: ${assets[currency]} USD</p>
                        <p className="item">Current position: <strong>{assets[currency]}</strong></p>
                    </div>          
                </div> 
            ))
            }   
            <span className="textWarning">Important: You can only finalize your portfolio once! Choose wisely...</span>
            <button className="submitBtn" onClick = {submitPortfolio}>Submit Portfolio</button>
        </div>
    )
}

const mapStateToProps = (state) => ({
    username: state.username,
    userInfo: state.userInfo
})


export default (connect)(mapStateToProps)(EditPortfolio)


export function ViewPortfolio({username, portfolio, tokens}){


    return(
        <div className = "viewPortfolio">           
            <h1><u className = "title">{username}'s Portfolio</u></h1>
            
            <div className="centerText">
                Total Account Value<br/>
                <span className="totalVal">$50,000.00</span>
            </div>
            <div className="background-color">

            {tokens.map((coin) => (
                coin !== "canEdit" ? (
                    
                        <div className="assets">
                            <span>{coin} </span>
                            <span>  ${portfolio[coin]}</span>
                        </div>     
                      
                ) : (
                    <div></div>
                )
                ))
            }
            </div>  
        </div>
    )
}