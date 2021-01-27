import React, { Component } from 'react'
import "./PracticeCounter.css"

<<<<<<< HEAD


export class PracticeCounter extends Component {
=======
class PracticeCounter extends Component {
>>>>>>> 962bd71b1d8ad7d04033db0c4531a794a437363f
    constructor(){
        super()
        this.state = {
            count: 0
        }
    }


<<<<<<< HEAD
=======
    
>>>>>>> 962bd71b1d8ad7d04033db0c4531a794a437363f
    incrementCount(){
        this.setState({
            count: this.state.count + 1
        })
        console.log(this.state.count)
    }


    render() {
        return (
            <div>
                <p><strong>Count: </strong> {this.state.count}</p>

                <button className = "styled-btn" onClick={() => this.incrementCount()}>Increment</button>    
            </div>
        )
    }
}

export default PracticeCounter
