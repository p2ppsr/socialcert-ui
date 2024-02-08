import React, { useState } from 'react'


    const Auth = () =>{
    
        // TODO: This link will need to be remade for not a localhost redirect
    return window.location.href = "https://discord.com/api/oauth2/authorize?client_id=1202716017055375421&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8088%2FAuthRedirect&scope=identify"; 
    }



export default Auth