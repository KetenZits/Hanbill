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
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      const errData = await res.text(); // อ่านเป็น text จะได้เห็น raw error
      console.error("Register raw error:", errData);
      throw new Error("Register failed");
    }

    return res.json();
  } catch (err) {
    console.error("Register API error:", err);
    throw err;
  }
}
