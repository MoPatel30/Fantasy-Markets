import React from 'react'
import "./CreateGame.css";

function CreateGame() {
    return (
        <div className="form-style-5">
           <form>
                <fieldset>
                    <legend><span class="number">$</span> Create A Game!</legend>
                    <input type="text" name="field1" placeholder="Name of Game" />
                    <input type="number" name="field2" placeholder="Starting Amount of USD" />
                    
                    <label for="job">Duration of Game:</label>
                    <select id="job" name="field3">
                    <optgroup label="Weeks">
                        <option value="2">1 Week</option>
                        <option value="3">2 Weeks</option>
                        
                    </optgroup>
                    </select>    
                    <label for="job">Number of Investors:</label>
                    <select id="job" name="field4">
                    <optgroup label="Investors">
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </optgroup>
                    </select>      
                    </fieldset>
                    <button type="submit" onClick="#"> Start Game </button>
            </form>
        </div>
    )
}

export default CreateGame
