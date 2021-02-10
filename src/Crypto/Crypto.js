import React, {useState, useEffect, prevState} from 'react'
import "./Crypto.css"
const rp = require('request-promise');



function Crypto({portfolio}) {
    const [price, setPrice] = useState("")
    //const [prices, setPrices] = useState([0])

    function getCoinInfo(currency, amount){
        const requestOptions = {
            method: 'GET',
            uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
            qs: {
              'slug': currency,
            },
            headers: {
              'X-CMC_PRO_API_KEY': ''
            },
            json: true,
            gzip: true
          };
          
          rp(requestOptions).then(response => {
            console.log('API call response:', response)
            setPrice(String(response.data[Object.keys(response.data)[0]].quote.USD.price))
            //setPrices([...prices, price])
            return amount / price
          }).catch((err) => {
            console.log('API call error:', err.message)
            return 0
          })

    }

    /*
        <input type = "text" placeholder="Enter currency name" onChange = {(e) => setName(e.target.value)}></input>
        <button type = "submit" onClick = {getCoinInfo}>Enter</button>
            
    */

    return (
        <div>
            <h1>Portfolio Breakdown</h1>
           
            {Object.keys(portfolio).map(currency => (
                <div>
                    <div>
                        <p>Name: {currency}</p>
                        <p>Amount deployed: {portfolio[currency]}</p>
                        <p>Current position: {getCoinInfo(currency, portfolio[currency])} {currency}</p>
                
                    </div>
                   
                </div>
            ))
            }
       
        </div>
    )
}


export default Crypto




export function CreatePortfolio() {
    const [amount, setAmount] = useState(10000)
    const [assets, setAssets] = useState({})
    const [coinName, setCoinName] = useState("")
    const [coinAmount, setCoinAmount] = useState(0)


    function addCoin(){
        if(Object.keys(assets).length > 4){
            alert("you are only allowed a maximum of 5 coins. Please rebalance your portfolio if you wish to use your remaining cash.")
        }
        if(amount - coinAmount < 0){
            alert("Not enough funds remaining")
        }
        else{

            let name = coinName

            setAssets({...assets, [name]: coinAmount}) 
           
            setAmount(amount - coinAmount)
            console.log(amount)
            setCoinName("")
            setCoinAmount(0)
            console.log(assets)
        }
    }


    return (
        <div>
            <p>Choose up to five coins to deploy money to</p>
            <p>Funds remaining: {amount}</p>

            <input type = "text" placeholder = "Full coin name" onChange = {(e) => setCoinName(e.target.value)}></input>
            <input type = "number" placeholder = "Amount in USD" onChange = {(e) => setCoinAmount(e.target.value)}></input>

            <button type = "submit" onClick = {addCoin}> Add coin </button>
            
            <Crypto portfolio = {assets} />
       
        </div>
    )
}

