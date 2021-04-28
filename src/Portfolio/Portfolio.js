import React, {useState, useEffect} from 'react'
import "./Portfolio.css"
import { connect } from 'react-redux'
import { db } from "../firebase"
import firebase from "firebase"
import store from ".././Redux/index"
const rp = require('request-promise');


function EditPortfolio({username, gameId, portfolio}) {
    const [assets, setAssets] = useState({})
    const [cashInvested, setCashInvested] = useState({})
    const [coinName, setCoinName] = useState("")
    const [coinAmount, setCoinAmount] = useState(0)
    const [cash, setCash] = useState(Number(portfolio["cash"]))

    async function addCoin(e){
        if(cash - coinAmount < 0){
            alert("Not enough funds remaining")
            return
        }
        if(Object.keys(assets).length >= 5){
            alert("You are only allowed a maximum of 5 coins. Please rebalance your portfolio if you wish to use your remaining cash.")
            return
        }
        else{
            let name = coinName
            let convertedPrice = 0
            db.collection("coin_prices").doc(name).get().then((doc) => {
                 let currentSeconds = Math.round(new Date().getTime());
                // checks if one day has passed. If not, do NOT update prices. (Can be backup just in case python script is down)
                if(doc.exists && (currentSeconds - doc.data().updatedAt <= 86400000)){
                    convertedPrice = coinAmount / doc.data().value

                    setCashInvested({...cashInvested, [name]: Number(coinAmount)}) 
                    setAssets({...assets, [name]: Number(convertedPrice)}) 
                    setCash(cash - Number(coinAmount))
                }
                else {
                    if(convertedPrice === 0){
                        const requestOptions = {
                            method: 'GET',
                            uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
                            qs: {
                            'slug': name,
                            },
                            
                            headers: {
                            'X-CMC_PRO_API_KEY': ""
                            },
                            json: true,
                            gzip: true
                        };
                        
                        rp(requestOptions).then(response => {
                            console.log('API call response:', response)

                            setTimeout(() => {
                            }, 1000)

                            db.collection("coin_prices").doc(name).set({ value: Number(response.data[Object.keys(response.data)[0]].quote.USD.price * 10000) / 10000, updatedAt: Math.round(new Date().getTime()) })
                            convertedPrice = Math.round((Number(coinAmount) / response.data[Object.keys(response.data)[0]].quote.USD.price) * 10000) / 10000
                            setCashInvested({...cashInvested, [name]: Number(coinAmount)}) 
                            setAssets({...assets, [name]: Number(convertedPrice)}) 
                            setCash(cash - Number(coinAmount))

                        }).catch((err) => {
                            console.log('API call error:', err.message)
                            alert("Please input a valid coin. (Check your spelling!)")
                        })
            
                    }
                }
            })

            setCoinName("")
            setCoinAmount(0)            
        }
    }

    function submitPortfolio(){
        assets["cash"] = cash
        assets["total"] = Number(portfolio["cash"])
        assets["canEdit"] = false
        db.collection("joinable_games").doc(gameId).set({[username]: assets}, {merge : true})
        
        setTimeout(() => {
            
        }, 3000);

        window.location.reload()
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

            {Object.keys(assets).map(currency => (
                <div>
                    <div className = "coin-info">
                        <span className="item">Name: {currency}</span>
                        <span className="item">Amount Invested: ${cashInvested[currency]} USD</span>
                        <span className="item">Current position: <strong>{Math.round(assets[currency] * 10000) / 10000} {currency}</strong></span>
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


export function ViewPortfolio({dailyCoinPrices, coinNames, username, portfolio, tokens, rank}){
    useEffect(() => {
        console.log(dailyCoinPrices)
        console.log(coinNames)
        console.log(username)
        console.log(portfolio)
        console.log(tokens)
        console.log(rank)
    }, [])

    useEffect(() => {

    }, [tokens])


    return(
        <div className = "viewPortfolio">           
            <h1><u className = "title">{username}'s Portfolio</u></h1>
            <br />
            <div>
                {rank === 1 ? (
                    <h1 style={{color: "goldenrod"}}>{rank}st Place</h1>
                ) : rank === 2 ? (
                    <h1 style={{color: "silver"}}>{rank}nd Place</h1>
                ) : rank === 3 ? (
                    <h1 style={{color: "brown"}}>{rank}rd Place</h1>
                ) : (
                    <h1 style={{color: "black"}}>{rank}rd Place</h1>
                )
                }
            </div>
            <br />

            <div className="centerText">
                <h3>Total Account Value: </h3>
                <span className="totalVal"><strong>${Math.round((Number(portfolio["total"]) * 100)) / 100}</strong></span>
            </div>

            <div className="background-color">
                {Object.keys(portfolio).map((coin) => (
                    coin === "canEdit" || coin === "total" ? (
                        <div></div>
                    ) : (                
                        <div className="assets">
                            <p>Asset: <strong>{coin}</strong> </p>
                            <p> Amount: <strong>{Math.round((Number(portfolio[coin]) * 10000)) / 10000} {coin}</strong> </p>
                            { coin === "cash" ? (
                                <p> Amount in USD: <strong>${portfolio[coin]}</strong> </p>
                            ) : (
                                <p> Amount in USD: <strong>${Math.round((portfolio[coin] * dailyCoinPrices[coinNames.indexOf(coin)]) * 100) / 100}</strong> </p>         
                            )    
                            }
                        </div>         
                    ) 
                    ))
                }
            </div> 
        </div>
    )
}