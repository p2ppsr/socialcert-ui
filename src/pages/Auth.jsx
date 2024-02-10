
    const Auth = () =>{
    const hostname = window.location.hostname;

    if(hostname.includes("staging")){
        return window.location.href = "https://discord.com/api/oauth2/authorize?client_id=1202716017055375421&response_type=code&redirect_uri=https%3A%2F%2Fstaging-discordcert.babbage.systems%2Fauthredirect&scope=identify"
    }
    else{
       return window.location.href = "https://discord.com/api/oauth2/authorize?client_id=1202716017055375421&response_type=code&redirect_uri=https%3A%2F%2Fdiscordcert.babbage.systems%2Fauthredirect&scope=identify"
    }


    }



export default Auth