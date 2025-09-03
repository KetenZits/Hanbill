export async function getBills(token: string){
    try{
        const res = await fetch("http://127.0.0.1:8000/api/bills", {
        headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
    }catch(err){
        console.log(err)
    }
}

export async function createBill (token: string, title: string){
    try{
        const res = await fetch("http://127.0.0.1:8000/api/bills", {
        method: "POST",
        headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title }),
    });
    return res.json();
    }catch(err){
        console.log(err)
    }
}