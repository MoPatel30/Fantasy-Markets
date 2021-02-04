import React, { Component } from 'react'
import "./PracticeCounter.css"

class PracticeCounter extends Component {
    constructor(){
        super()
        this.state = {
            count: 0
        }
    }


    
    incrementCount(){
        this.setState({
            count: this.state.count + 1
        })
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
