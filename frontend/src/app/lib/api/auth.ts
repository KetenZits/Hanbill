const API_URL = "http://127.0.0.1:8000"

export async function login (email: string, password: string){
    try{
    const res = await fetch(`${API_URL}/login`,{
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({email, password})
    })
    return res.json()
    }catch(err){
        console.log(err)
    }
}

export async function register(name: string, email: string, password: string){
    try{
    const res = await fetch(`${API_URL}/register`,{
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({name, email, password})
    })
    return res.json()
    }catch(err){
        console.log(err)
    }
}