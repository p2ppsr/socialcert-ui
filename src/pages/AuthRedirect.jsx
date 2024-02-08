import React, { useEffect } from 'react';

const AuthRedirect = () =>{
    useEffect(() =>{
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        console.log(code);

    }, []);
   // return window.location.href = "https://youtube.com";
   return (
    <div>Processing...</div>
    
  );
}

export default AuthRedirect
