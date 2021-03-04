import React, {useEffect, useState} from 'react'
import "./Investor.css"
import Portfolio from "../Portfolio/Portfolio"



function Investor() {
    const [name, setName] = useState("")
    const [investors, setInvestors] = useState(["Mo Patel"])


    function addInvestor(){
        investors.length < 10 ? setInvestors([...investors, name]) : alert("Max players reached")
    }


    return (
        <div>
            <label>Name: </label>
            <input type = "text" placeholder = "Name" onChange = {(e) => setName(e.target.value)}></input>
            <button type = "submit" onClick = {addInvestor}>Add user</button>
            
            {investors.map(investor => (
                <div>
                    <Portfolio name = {investor} />
                </div>
            ))
            }
        </div>
    )
}


export default Investor
