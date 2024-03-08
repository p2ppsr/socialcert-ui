import React, { useState } from 'react';





const PhoneRedirect = ()=>{
    const [name, setName] = useState('');
    console.log("Inside phoneRedirect")

    const handleUserInput = (event)=>{
        setName(event.target.value);
        console.log(name);
    }

    return (
        <form> 
            <label>
                Enter your phone number:
                <input type="text" value={name} onChange={handleUserInput}></input>
            </label>
            <button type="submit">Submit Phone Number</button>
        </form>
    )


}

export default PhoneRedirect