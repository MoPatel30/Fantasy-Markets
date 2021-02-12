import React, {useState} from 'react'
import Crypto from "../Crypto/Crypto"
import "./Portfolio.css"



function Portfolio({name}) {
    const [amount, setAmount] = useState(10000)
    const [assets, setAssets] = useState({})
    const [coinName, setCoinName] = useState("")
    const [coinAmount, setCoinAmount] = useState(0)
    const [numberOfCoins, setNumberOfCoins] = useState(5)

    function addCoin(){
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
          
            setCoinName("")
            setCoinAmount(0)
        }
    }


    return (
        <div className = "portfolio">           
            <h1><u className = "title">{name}'s Portfolio</u></h1>

            <div className = "add-coin">
                <p>Coins remaining: {numberOfCoins} </p>
                <p>Funds remaining: {amount}</p>

                <input type = "text" placeholder = "Full coin name" onChange = {(e) => setCoinName(e.target.value)}></input>
                <input type = "number" placeholder = "Amount in USD" onChange = {(e) => setCoinAmount(e.target.value)}></input>
                <button type = "submit" onClick = {addCoin}> Add coin </button>
            </div>

            <Crypto portfolio = {assets} />   
        </div>
    )
}


export default Portfolio