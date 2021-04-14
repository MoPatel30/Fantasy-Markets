import React, {useState, useEffect, prevState} from 'react'
import "./Crypto.css"
const rp = require('request-promise');
// uri: 'https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'


function Crypto({portfolio}) {
    const [price, setPrice] = useState(1)
    const [coinAmount, setCoinAmount] = useState(1)
    //const [prices, setPrices] = useState([0])

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
            setCoinAmount(Math.round((Number(amount) / price) * 10000) / 10000)
          }).catch((err) => {
            console.log('API call error:', err.message)
            setCoinAmount(1)
          })
          return coinAmount
    }

    return (
        <div>
            {Object.keys(portfolio).map(currency => (
                <div>
                    <div className = "coin-info">
                        <p className="item">Name: {currency}</p>
                        <p className="item">Amount Invested: ${portfolio[currency]} USD</p>
                        <p className="item">Current position: <strong>{getCoinInfo(currency, portfolio[currency])} {currency}</strong></p>
                    </div>       
                </div>
            ))
            }    
        </div>
    )
}


export default Crypto



