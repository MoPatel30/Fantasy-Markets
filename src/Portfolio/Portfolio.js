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
    const [price, setPrice] = useState(1)
    const [currentCoinAmount, setCurrentCoinAmount] = useState(1)
    const [cash, setCash] = useState(Number(portfolio["cash"]))


    async function getCoinInfo(currency, amount){
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
           
          await rp(requestOptions).then(response => {
            console.log('API call response:', response)
            const tempPrice = response.data[Object.keys(response.data)[0]].quote.USD.price
            console.log(tempPrice)
            setPrice(tempPrice)
            setTimeout(() => {
            }, 1000)
            console.log(response.data[Object.keys(response.data)[0]].quote.USD.price)
            
            setCurrentCoinAmount(Math.round((Number(amount) / response.data[Object.keys(response.data)[0]].quote.USD.price) * 10000) / 10000)
            console.log(Math.round((Number(amount) / response.data[Object.keys(response.data)[0]].quote.USD.price) * 10000) / 10000)
            return currentCoinAmount
          }).catch((err) => {
            console.log('API call error:', err.message)
            setCurrentCoinAmount(1)
            return currentCoinAmount
          })
    }
    
    async function addCoin(e){
        if(cash - coinAmount < 0){
            alert("Not enough funds remaining")
        }
        if(Object.keys(assets).length >= 5){
            alert("You are only allowed a maximum of 5 coins. Please rebalance your portfolio if you wish to use your remaining cash.")
        }
        else{
            let name = coinName
            let convertedPrice = 0
            db.collection("coin_prices").doc(name).get().then((doc) => {
                 let currentSeconds = Math.round(new Date().getTime());
                // checks if one day has passed. If not, do NOT update prices
                if(doc.exists && (currentSeconds - doc.data().updatedAt <= 86400000)){

                    convertedPrice = coinAmount / doc.data().value
                    console.log(convertedPrice)

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
                            'X-CMC_PRO_API_KEY': "1d62807d-b858-4715-9a04-5fdfb1414cb0"
                            },
                            json: true,
                            gzip: true
                        };
                        
                        rp(requestOptions).then(response => {
                            console.log('API call response:', response)

                            const tempPrice = response.data[Object.keys(response.data)[0]].quote.USD.price
                            setPrice(tempPrice)

                            setTimeout(() => {
                            }, 1000)

                            console.log(response.data[Object.keys(response.data)[0]].quote.USD.price)
                            
                            setCurrentCoinAmount(Math.round((Number(coinAmount) / response.data[Object.keys(response.data)[0]].quote.USD.price) * 10000) / 10000)
                            console.log(Math.round((Number(coinAmount) / response.data[Object.keys(response.data)[0]].quote.USD.price) * 10000) / 10000)
                            
                            db.collection("coin_prices").doc(name).set({ value: response.data[Object.keys(response.data)[0]].quote.USD.price, updatedAt: Math.round(new Date().getTime()) })
                            convertedPrice = Math.round((Number(coinAmount) / response.data[Object.keys(response.data)[0]].quote.USD.price) * 10000) / 10000
                            setCashInvested({...cashInvested, [name]: Number(coinAmount)}) 
                            setAssets({...assets, [name]: Number(convertedPrice)}) 
                            setCash(cash - Number(coinAmount))

                        }).catch((err) => {
                            console.log('API call error:', err.message)
                            alert("Please input a valid coin. (Check your spelling!)")
                            setCurrentCoinAmount(1)
                        })
                        // getCoinInfo(name, coinAmount).then(() => {
                        //     console.log("object")
                        //     db.collection("coin_prices").doc(name).set({ value: price, updatedAt: firebase.firestore.FieldValue.serverTimestamp() })
                        //     convertedPrice = currentCoinAmount
                        // })
                    }
                }
            })

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
                        <p className="item">Amount Invested: ${cashInvested[currency]} USD</p>
                        <p className="item">Current position: <strong>{assets[currency]} {currency}</strong></p>
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
    const [coinNames, setCoinNames] = useState([])
    const [dailyCoinPrices, setDailyCoinPrices] = useState({})
    
    async function getMarkers() {
        const prices = await firebase.firestore().collection('coin_prices')
        prices.get().then((querySnapshot) => {
            setCoinNames(querySnapshot.docs.map(doc => doc.id))
            setDailyCoinPrices(querySnapshot.docs.map(doc => doc.data().value))    
           
            console.log(coinNames)
            console.log(dailyCoinPrices)
          }) 
      }

    useEffect(() => {
        getMarkers()
        // db.collection('coin_prices').onSnapshot(snapshot => {  
        //     snapshot.docs.map(doc => (
        //         //setAssets({...assets, [name]: Number(convertedPrice)}) 
        //         //console.log(doc.data().value)
        //         //dailyCoinPrices[doc.id] = doc.data().value
        //         setDailyCoinPrices({...dailyCoinPrices, [doc.id] : doc.data().value})  
        //     )) 
        // })     
       
    }, [portfolio, username, tokens])

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
                        
                        <span>  {portfolio[coin]} {coin}</span><br/>
                        <span> Amount in USD:{Math.round((portfolio[coin] * dailyCoinPrices[coinNames.indexOf(coin)]) * 100) / 100} </span>
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