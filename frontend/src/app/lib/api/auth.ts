const API_URL = "http://127.0.0.1:8000/api"

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


export async function register(name: string, email: string, password: string) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Register API error:', error);
        throw error;
    }
}
