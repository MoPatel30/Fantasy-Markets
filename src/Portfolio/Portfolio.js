import React, {useState, useEffect} from 'react'
import "./Portfolio.css"
import { connect } from 'react-redux'
import { db } from "../firebase"
import firebase from "firebase"
import store from ".././Redux/index"
import * as d3 from 'd3'
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
        }
        if(Object.keys(assets).length >= 5){
            alert("You are only allowed a maximum of 5 coins. Please rebalance your portfolio if you wish to use your remaining cash.")
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
                            'X-CMC_PRO_API_KEY': "1d62807d-b858-4715-9a04-5fdfb1414cb0"
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
        db.collection("joinable_games").doc(gameId).set({[store.getState().username]: assets}, {merge : true})
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
    const [dailyCoinPrices, setDailyCoinPrices] = useState([])
    const ref = React.createRef()

    async function getMarkers() {
        const prices = await firebase.firestore().collection('coin_prices')
        prices.get().then((querySnapshot) => {
            setCoinNames(querySnapshot.docs.map(doc => doc.id))
            setDailyCoinPrices(querySnapshot.docs.map(doc => doc.data().value))    
          }) 
      }

    useEffect(() => {
        getMarkers()

        // let margin = { top: 30, right: 120, bottom: 30, left: 50 }
        // let width = 960 - margin.left - margin.right
        // let height = 500 - margin.top - margin.bottom
        // let tooltip = { width: 100, height: 100, x: 10, y: -30 };

        // //initialize margin end
        // var svg = d3.select("body").append("svg")
        //     .attr("width", width + margin.left + margin.right)
        //     .attr("height", height + margin.top + margin.bottom)
        //     .append("g")
        //     .attr("transform", "translate(" + width/2 + "," + height/2+ ")");
        
        // var pie = d3.pie()
        // .sort(null)
        // .value(d => d.population);

        // var arc = d3.arc()
        // .innerRadius(0)
        // .outerRadius(Math.min(width, height) / 2 - 1);

        // var arcLabel = function(){
        //     const radius = Math.min(width, height) / 2 * 0.8;
        //     return d3.arc().innerRadius(radius).outerRadius(radius);
        // }
        
        // let data = [{
        //     "bitcoin": 34933, 
        //     "ethereum": 4000, 
        //     "monero": 900, 
        //     "uniswap": 1400, 
        //     "dash": 1200, 
        //     "cash": 900, 
        // }]

        // var color = d3.scaleOrdinal()
        // .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())
        // const arcs = pie(data);
        //     svg.append("g")
        // .attr("stroke", "white")
        // .selectAll("path")
        // .data(arcs)
        // .enter().append("path")
        // .attr("fill", d => color(d.data.age))
        // .attr("d", arc)
        // .append("title")
        // .text(d => `${d.data.}: ${d.data.population.toLocaleString()}`);

        // svg.append("g")
        // .attr("font-family", "sans-serif")
        // .attr("font-size", 12)
        // .attr("text-anchor", "middle")
        // .selectAll("text")
        // .data(arcs)
        // .enter().append("text")
        // .attr("transform", d => `translate(${arcLabel().centroid(d)})`)
        // .call(text => text.append("tspan")
        //     .attr("y", "-0.4em")
        //     .attr("font-weight", "bold")
        //     .text(d => d.data.age))
        // .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        //     .attr("x", 0)
        //     .attr("y", "0.7em")
        //     .attr("fill-opacity", 0.7)
        //     .text(d => d.data.population.toLocaleString()));
        

    
    }, [portfolio, username, tokens])

    return(
        <div className = "viewPortfolio">           
            <h1><u className = "title">{username}'s Portfolio</u></h1>
            
            <div className="centerText">
                Total Account Value<br/>
                <span className="totalVal">${portfolio["total"]}</span>
            </div>
            <div className="background-color">
                {tokens.map((coin) => (
                    coin === "canEdit" || coin === "total" ? (
                        <div></div>
                    ) : (                
                        <div style={{color: "white"}}>
                            <span>Asset: {coin} </span>
                            <span> Amount: {portfolio[coin]} {coin}</span>
                            { coin === "cash" ? (
                                <span> Amount in USD: {portfolio[coin]} </span>
                            ) : (
                                <span> Amount in USD: {Math.round((portfolio[coin] * dailyCoinPrices[coinNames.indexOf(coin)]) * 100) / 100} </span>         
                            )    
                            }
                        </div>         
                    ) 
                    ))
                }
                <div ref={ref}></div>
            </div>  
        </div>
    )
}