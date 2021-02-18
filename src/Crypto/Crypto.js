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
            //3164df64-a813-4a8b-a580-b2e741064780
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
           
            {Object.keys(portfolio).map(currency => (
                <div>
                    <div className = "coin-info">
                        <p>Name: {currency}</p>
                        <p>Amount Invested: {portfolio[currency]} USD</p>
                        <p>Current position: {getCoinInfo(currency, portfolio[currency])} {currency}</p>
                    </div>
                   
                </div>
            ))
            }
       
        </div>
    )
}


export default Crypto



